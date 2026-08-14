import { useState } from "react";
import { useAppDispatch } from "./reduxHooks";
import { resizeImage } from "../Utils/imageProcessing";
import { identifyTitleFromImage } from "../Utils/geminiVision";
import { searchTMDBMulti, getMediaDetails } from "../Utils/tmdbLookup";
import { addUserMessage, addAssistantMessage } from "../Utils/gptSlice";

interface UseChatImageSearchReturn {
  sendImage: (file: File) => Promise<void>;
  isProcessing: boolean;
}

const useChatImageSearch = (): UseChatImageSearchReturn => {
  const dispatch = useAppDispatch();
  const [isProcessing, setIsProcessing] = useState(false);

  const sendImage = async (file: File): Promise<void> => {
    if (!file || isProcessing) return;
    setIsProcessing(true);

    try {
      const { base64, dataUrl, mimeType } = await resizeImage(file);

      dispatch(addUserMessage({ text: "Uploaded an image", image: dataUrl }));

      const guess = await identifyTitleFromImage({ base64, mimeType });

      if (!guess || guess.toUpperCase() === "UNKNOWN") {
        dispatch(
          addAssistantMessage({
            text: "I couldn't quite make that out — try a clearer screenshot with a visible scene or on-screen text.",
            movies: [],
            movieDetail: null,
          })
        );
        return;
      }

      const match = await searchTMDBMulti(guess);
      if (!match) {
        dispatch(
          addAssistantMessage({
            text: `I think this might be "${guess}", but I couldn't find it in the database.`,
            movies: [],
            movieDetail: null,
          })
        );
        return;
      }

      const details = await getMediaDetails(match);
      dispatch(
        addAssistantMessage({
          text: `This looks like ${details.title}! Here's more about it:`,
          movies: [],
          movieDetail: details,
        })
      );
    } catch (err) {
      console.error("Chat image search failed:", err);
      dispatch(
        addAssistantMessage({
          text: "Sorry, I ran into an error analyzing that image. Please try again.",
          movies: [],
          movieDetail: null,
        })
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return { sendImage, isProcessing };
};

export default useChatImageSearch;

