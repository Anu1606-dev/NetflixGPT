import { useState } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { API_OPTIONS, TMDB_BASE_URL, GEMINI_LITE_URL, GEMINI_STREAM_URL } from "../Utils/constants";
import { GEMINI_TOOLS } from "../Utils/geminiTools";
import { addUserMessage, addAssistantMessage } from "../Utils/gptSlice";
import { buildTasteProfile } from "../Utils/buildTasteProfile";
import { MovieDetail } from "../Utils/types";

const BASE_SYSTEM_TEXT =
  "You are a friendly movie and TV assistant inside a Netflix-style app. Always reply in a warm, " +
  "conversational tone, like a knowledgeable friend, not a robot. Use the functions available to you " +
  "whenever the user is asking about movies or shows — don't just describe them in plain text. " +
  "If the user is just chatting casually and not asking about movies, reply normally without calling a function.";

// Lightweight, no taste profile — used only for the fast "which function?" decision
const DECISION_SYSTEM_INSTRUCTION = { parts: [{ text: BASE_SYSTEM_TEXT }] };

interface UseGptChatReturn {
  sendMessage: (userText: string) => Promise<void>;
  isStreaming: boolean;
  streamingText: string;
  statusText: string;
}

const useGptChat = (): UseGptChatReturn => {
  const dispatch = useAppDispatch();
  const conversation = useAppSelector((store) => store.gpt.conversation);
  const myListItems = useAppSelector((store) => store.myList.items);
  const continueWatchingItems = useAppSelector((store) => store.continueWatching.items);
  const [streamingText, setStreamingText] = useState("");
  const [statusText, setStatusText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  // Full instruction with taste profile — used only for the final visible reply
  const buildFinalSystemInstruction = () => {
    const tasteProfile = buildTasteProfile(myListItems, continueWatchingItems);
    const text = tasteProfile ? `${BASE_SYSTEM_TEXT}\n\n${tasteProfile}` : BASE_SYSTEM_TEXT;
    return { parts: [{ text }] };
  };

  const searchMovieTMDB = async (movieName: string): Promise<any> => {
    const data = await fetch(
      `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(movieName)}&page=1`,
      API_OPTIONS
    );
    const json = await data.json();
    return json.results?.[0] || null;
  };

  const getMovieDetails = async (movieName: string): Promise<MovieDetail | null> => {
    const match = await searchMovieTMDB(movieName);
    if (!match) return null;

    const data = await fetch(
      `${TMDB_BASE_URL}/movie/${match.id}?append_to_response=videos,credits`,
      API_OPTIONS
    );
    const details = await data.json();

    const trailer =
      details.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube") ||
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
      genres: details.genres?.map((g: any) => g.name) || [],
      rating: details.vote_average || 0,
      trailerKey: trailer?.key || null,
      cast: (details.credits?.cast || []).slice(0, 5).map((c: any) => ({
        name: c.name,
        character: c.character,
      })),
    };
  };

  // Phase 1 — fast, lite model, no personalization context, just decides what to do
  const decideAction = async (contents: any[]): Promise<{ modelContent: any; firstPart: any }> => {
    const response = await fetch(GEMINI_LITE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.REACT_APP_GEMINI_KEY as string,
      },
      body: JSON.stringify({
        system_instruction: DECISION_SYSTEM_INSTRUCTION,
        contents,
        tools: GEMINI_TOOLS,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Gemini decideAction error:", response.status, errorBody);
      throw new Error(`Gemini request failed (status ${response.status})`);
    }

    const json = await response.json();
    const modelContent = json?.candidates?.[0]?.content;
    const firstPart = modelContent?.parts?.[0];
    return { modelContent, firstPart };
  };

  // Phase 2 — full model, streamed, personalized, this is what the user actually reads
  const streamFinalReply = async (
    contents: any[],
    systemInstruction: { parts: { text: string }[] }
  ): Promise<string> => {
    const response = await fetch(GEMINI_STREAM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.REACT_APP_GEMINI_KEY as string,
      },
      body: JSON.stringify({ system_instruction: systemInstruction, contents }),
    });

    if (!response.ok || !response.body) {
      const errorBody = await response.text();
      console.error("Gemini streamFinalReply error:", response.status, errorBody);
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
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (!jsonStr) continue;

        try {
          const parsed = JSON.parse(jsonStr);
          const delta = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (delta) {
            fullText += delta;
            setStreamingText(fullText);
          }
        } catch {
          // incomplete chunk, safe to ignore
        }
      }
    }

    return fullText.trim();
  };

  const sendMessage = async (userText: string): Promise<void> => {
    dispatch(addUserMessage(userText));
    setIsStreaming(true);
    setStreamingText("");
    setStatusText("Thinking...");

    const baseContents = [
      ...conversation.map((turn) => ({
        role: turn.role === "user" ? "user" : "model",
        parts: [{ text: turn.text }],
      })),
      { role: "user", parts: [{ text: userText }] },
    ];

    try {
      const { modelContent, firstPart } = await decideAction(baseContents);

      if (!firstPart?.functionCall) {
        const plainText = firstPart?.text?.trim() || "I'm not sure how to help with that.";
        dispatch(addAssistantMessage({ text: plainText, movies: [], movieDetail: null }));
        return;
      }

      const { name, args } = firstPart.functionCall;
      let movies: any[] = [];
      let movieDetail: MovieDetail | null = null;
      let functionResult: any;

      if (name === "recommend_movies") {
        setStatusText("Finding movies...");
        const titles = (args.movie_titles || []).slice(0, 5);
        movies = (await Promise.all(titles.map((t: string) => searchMovieTMDB(t)))).filter(Boolean);
        functionResult = { success: movies.length > 0, count: movies.length };
      } else if (name === "get_movie_details") {
        setStatusText("Looking up details...");
        movieDetail = await getMovieDetails(args.title);
        functionResult = movieDetail
          ? {
              title: movieDetail.title,
              overview: movieDetail.overview?.slice(0, 200),
              releaseYear: movieDetail.releaseYear,
              rating: movieDetail.rating,
            }
          : { success: false };
      } else {
        functionResult = { success: false, error: "Unknown function" };
      }

      setStatusText("Writing reply...");

      const contentsWithFunctionResult = [
        ...baseContents,
        modelContent,
        { role: "user", parts: [{ functionResponse: { name, response: functionResult } }] },
      ];

      const finalText = await streamFinalReply(contentsWithFunctionResult, buildFinalSystemInstruction());

      dispatch(
        addAssistantMessage({
          text: finalText || "Here's what I found:",
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
      setStatusText("");
    }
  };

  return { sendMessage, isStreaming, streamingText, statusText };
};

export default useGptChat;