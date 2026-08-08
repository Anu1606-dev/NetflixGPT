import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, TMDB_BASE_URL, GEMINI_STREAM_URL } from "../Utils/constants";
import { addUserMessage, addAssistantMessage } from "../Utils/gptSlice";

const SYSTEM_INSTRUCTION = {
  parts: [{
    text:
      "You are a friendly movie recommendation assistant inside a Netflix-style app. " +
      "Reply conversationally in 1-2 short sentences about what you're suggesting and why, " +
      "like a knowledgeable friend, not a robot. Then, on a new line, write exactly MOVIES: " +
      "followed by exactly 5 real movie names separated by commas, nothing else after. " +
      "If the user is refining an earlier request (e.g. 'funnier', 'shorter', 'not that one'), " +
      "take the prior conversation into account and adjust accordingly.",
  }],
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
    return json.results?.[0] || null; // best match only
  };

  const sendMessage = async (userText) => {
    dispatch(addUserMessage(userText));
    setIsStreaming(true);
    setStreamingText("");

    // Build full history so Gemini can see previous turns (this is what makes follow-ups work)
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
        buffer = lines.pop(); // keep any incomplete trailing line for the next chunk

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (delta) {
              fullText += delta;
              // only show the conversational part live — hide the raw "MOVIES:" list while streaming
              setStreamingText(fullText.split("MOVIES:")[0]);
            }
          } catch {
            // partial/incomplete JSON chunk — safe to ignore, next chunk completes it
          }
        }
      }

      const [conversationalText, moviesPart] = fullText.split("MOVIES:");
      const movieNames = (moviesPart || "")
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean)
        .slice(0, 5);

      const movies = (await Promise.all(movieNames.map(searchMovieTMDB))).filter(Boolean);

      dispatch(
        addAssistantMessage({
          text: conversationalText.trim() || "Here's what I found:",
          movies,
        })
      );
    } catch (err) {
      console.error("GPT chat error:", err);
      dispatch(
        addAssistantMessage({
          text: "Sorry, I ran into an error finding recommendations. Please try again.",
          movies: [],
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