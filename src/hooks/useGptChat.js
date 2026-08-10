import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, TMDB_BASE_URL, GEMINI_STREAM_URL } from "../Utils/constants";
import { addUserMessage, addAssistantMessage } from "../Utils/gptSlice";

const SYSTEM_INSTRUCTION = {
  parts: [{
    text:
      "You are a friendly movie and TV assistant inside a Netflix-style app. Reply conversationally " +
      "in 1-2 short sentences, like a knowledgeable friend, not a robot. Then, on a new line, do exactly ONE of the following:\n\n" +
      "1. If the user is asking about details of ONE specific movie or show by name (plot, cast, trailer, rating, when it came out, is it good, etc.), write exactly: DETAIL: <exact title>\n\n" +
      "2. If the user wants recommendations, a list, or multiple movies (based on mood, genre, similarity, or a vague request), write exactly: MOVIES: followed by exactly 5 real movie names, comma separated.\n\n" +
      "Never include both DETAIL: and MOVIES: in the same response. If the user is refining an earlier recommendation request (e.g. 'funnier', 'shorter'), stay in MOVIES mode using the prior conversation as context, unless they clearly pivot to asking about one specific title, in which case switch to DETAIL mode.",
  }],
};

// Splits off the visible conversational text before either marker appears,
// so streaming never shows the raw DETAIL:/MOVIES: instruction to the user.
const getDisplayText = (text) => {
  const detailIdx = text.indexOf("DETAIL:");
  const moviesIdx = text.indexOf("MOVIES:");
  const indices = [detailIdx, moviesIdx].filter((i) => i !== -1);
  if (indices.length === 0) return text;
  return text.slice(0, Math.min(...indices));
};

const useGptChat = () => {
  const dispatch = useDispatch();
  const conversation = useSelector((store) => store.gpt.conversation);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const searchMovieTMDB = async (movieName) => {
    const data = await fetch(
      `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(movieName)}&page=1`,
      API_OPTIONS
    );
    const json = await data.json();
    return json.results?.[0] || null;
  };

  // Finds the movie on TMDB, then fetches full details (videos + credits) for it
  const getMovieDetails = async (movieName) => {
    const match = await searchMovieTMDB(movieName);
    if (!match) return null;

    const data = await fetch(
      `${TMDB_BASE_URL}/movie/${match.id}?append_to_response=videos,credits`,
      API_OPTIONS
    );
    const details = await data.json();

    const trailer =
      details.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
      details.videos?.results?.[0] ||
      null;

    return {
      id: details.id,
      title: details.title,
      overview: details.overview,
      posterPath: details.poster_path,
      backdropPath: details.backdrop_path,
      releaseYear: details.release_date?.slice(0, 4) || null,
      runtime: details.runtime || 0,
      genres: details.genres?.map((g) => g.name) || [],
      rating: details.vote_average || 0,
      trailerKey: trailer?.key || null,
      cast: (details.credits?.cast || []).slice(0, 5).map((c) => ({
        name: c.name,
        character: c.character,
      })),
    };
  };

  const sendMessage = async (userText) => {
    dispatch(addUserMessage(userText));
    setIsStreaming(true);
    setStreamingText("");

    const contents = [
      ...conversation.map((turn) => ({
        role: turn.role === "user" ? "user" : "model",
        parts: [{ text: turn.text }],
      })),
      { role: "user", parts: [{ text: userText }] },
    ];

    try {
      const response = await fetch(GEMINI_STREAM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.REACT_APP_GEMINI_KEY,
        },
        body: JSON.stringify({ system_instruction: SYSTEM_INSTRUCTION, contents }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Gemini request failed (status ${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (delta) {
              fullText += delta;
              setStreamingText(getDisplayText(fullText));
            }
          } catch {
            // incomplete chunk, safe to ignore
          }
        }
      }

      let conversationalText = getDisplayText(fullText).trim();
      let movies = [];
      let movieDetail = null;

      if (fullText.includes("DETAIL:")) {
        const movieName = fullText.split("DETAIL:")[1].trim();
        movieDetail = await getMovieDetails(movieName);
      } else if (fullText.includes("MOVIES:")) {
        const moviesPart = fullText.split("MOVIES:")[1] || "";
        const movieNames = moviesPart
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean)
          .slice(0, 5);
        movies = (await Promise.all(movieNames.map(searchMovieTMDB))).filter(Boolean);
      }

      dispatch(
        addAssistantMessage({
          text: conversationalText || "Here's what I found:",
          movies,
          movieDetail,
        })
      );
    } catch (err) {
      console.error("GPT chat error:", err);
      dispatch(
        addAssistantMessage({
          text: "Sorry, I ran into an error. Please try again.",
          movies: [],
          movieDetail: null,
        })
      );
    } finally {
      setIsStreaming(false);
      setStreamingText("");
    }
  };

  return { sendMessage, isStreaming, streamingText };
};

export default useGptChat;