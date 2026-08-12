import { GEMINI_LITE_URL } from "./constants";

const IDENTIFY_PROMPT =
  "Look closely at this screenshot from a movie or TV show. Consider character appearance, " +
  "setting, on-screen text, subtitles, logos, and art style. Respond with ONLY the exact title " +
  "of the movie or TV show — no explanation, no punctuation, nothing else. " +
  "If you cannot confidently identify it, respond with exactly: UNKNOWN";

export const identifyTitleFromImage = async ({ base64, mimeType }, signal) => {
  const response = await fetch(GEMINI_LITE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.REACT_APP_GEMINI_KEY,
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            { text: IDENTIFY_PROMPT },
            { inlineData: { mimeType, data: base64 } },
          ],
        },
      ],
    }),
    signal,
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error("Gemini image identify error:", response.status, errBody);
    throw new Error("Couldn't analyze the image right now.");
  }

  const json = await response.json();
  const guess = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  return guess || null;
};