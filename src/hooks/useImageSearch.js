import { useState } from "react";
import { API_OPTIONS, TMDB_BASE_URL, GEMINI_URL } from "../Utils/constants";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result looks like "data:image/png;base64,AAAA..." — strip the prefix, Gemini only wants the raw base64
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const IDENTIFY_PROMPT =
  "Look closely at this screenshot from a movie or TV show. Consider character appearance, " +
  "setting, on-screen text, subtitles, logos, and art style. Respond with ONLY the exact title " +
  "of the movie or TV show — no explanation, no punctuation, nothing else. " +
  "If you cannot confidently identify it, respond with exactly: UNKNOWN";

const useImageSearch = () => {
  const [preview, setPreview] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const searchTMDBMulti = async (title) => {
    const data = await fetch(
      `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(title)}&page=1`,
      API_OPTIONS
    );
    const json = await data.json();
    return (json.results || []).find((r) => r.media_type === "movie" || r.media_type === "tv") || null;
  };

  const getDetails = async (match) => {
    const endpoint = match.media_type === "tv" ? "tv" : "movie";
    const data = await fetch(
      `${TMDB_BASE_URL}/${endpoint}/${match.id}?append_to_response=videos,credits`,
      API_OPTIONS
    );
    const details = await data.json();

    const trailer =
      details.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
      details.videos?.results?.[0] ||
      null;

    return {
      id: details.id,
      title: details.title || details.name,
      overview: details.overview,
      posterPath: details.poster_path,
      backdropPath: details.backdrop_path,
      releaseYear: (details.release_date || details.first_air_date || "").slice(0, 4) || null,
      runtime: details.runtime || details.episode_run_time?.[0] || 0,
      genres: details.genres?.map((g) => g.name) || [],
      rating: details.vote_average || 0,
      trailerKey: trailer?.key || null,
      cast: (details.credits?.cast || []).slice(0, 5).map((c) => ({
        name: c.name,
        character: c.character,
      })),
    };
  };

  const identifyImage = async (file) => {
    setIsSearching(true);
    setError(null);
    setResult(null);
    setPreview(URL.createObjectURL(file));

    try {
      const base64 = await fileToBase64(file);

      const response = await fetch(GEMINI_URL, {
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
                { inlineData: { mimeType: file.type, data: base64 } },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error("Gemini image identify error:", response.status, errBody);
        throw new Error("Couldn't analyze the image right now.");
      }

      const json = await response.json();
      const guess = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!guess || guess.toUpperCase() === "UNKNOWN") {
        setError("Couldn't identify a movie or show from that image. Try a clearer screenshot.");
        return;
      }

      const match = await searchTMDBMulti(guess);
      if (!match) {
        setError(`Gemini thinks this might be "${guess}", but it wasn't found on TMDB.`);
        return;
      }

      const details = await getDetails(match);
      setResult(details);
    } catch (err) {
      console.error("Image search failed:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    setIsSearching(false);
  };

  return { identifyImage, preview, isSearching, result, error, reset };
};

export default useImageSearch;