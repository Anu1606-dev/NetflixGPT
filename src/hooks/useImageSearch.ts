import { useState, useRef } from "react";
import { resizeImage } from "../Utils/imageProcessing";
import { identifyTitleFromImage } from "../Utils/geminiVision";
import { searchTMDBMulti, getMediaDetails } from "../Utils/tmdbLookup";
import { MovieDetail } from "../Utils/types";

interface UseImageSearchReturn {
  identifyImage: (file: File) => Promise<void>;
  preview: string | null;
  isSearching: boolean;
  status: string;
  result: MovieDetail | null;
  error: string | null;
  reset: () => void;
}

const useImageSearch = (): UseImageSearchReturn => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<MovieDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const identifyImage = async (file: File): Promise<void> => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsSearching(true);
    setError(null);
    setResult(null);

    try {
      setStatus("Optimizing image...");
      const { base64, dataUrl, mimeType } = await resizeImage(file);
      setPreview(dataUrl);

      setStatus("Identifying with AI...");
      const guess = await identifyTitleFromImage({ base64, mimeType }, controller.signal);

      if (!guess || guess.toUpperCase() === "UNKNOWN") {
        setError("Couldn't identify a movie or show from that image. Try a clearer screenshot.");
        return;
      }

      setStatus("Fetching details...");
      const match = await searchTMDBMulti(guess, controller.signal);
      if (!match) {
        setError(`Gemini thinks this might be "${guess}", but it wasn't found on TMDB.`);
        return;
      }

      const details = await getMediaDetails(match, controller.signal);
      setResult(details);
    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.error("Image search failed:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSearching(false);
      setStatus("");
    }
  };

  const reset = (): void => {
    abortRef.current?.abort();
    setPreview(null);
    setResult(null);
    setError(null);
    setIsSearching(false);
    setStatus("");
  };

  return { identifyImage, preview, isSearching, status, result, error, reset };
};

export default useImageSearch;

