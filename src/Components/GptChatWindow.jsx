import React from 'react';
import { useSelector } from 'react-redux';
import MovieList from './MovieList';
import { IMG_CDN_URL } from '../Utils/constants';

const toCardData = (movies) =>
  movies?.map((movie) => ({
    id: movie.id,
    image: IMG_CDN_URL + movie.poster_path,
    title: movie.title,
    mediaType: "movie",
  })) || [];

const SUGGESTIONS = [
  "Something like Inception but shorter",
  "Feel-good movies for a rainy day",
  "Underrated thrillers from the 2010s",
  "Movies to watch with family tonight",
];

const AiAvatar = () => (
  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center flex-shrink-0">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    </svg>
  </div>
);

const GptChatWindow = ({ streamingText, isStreaming, onSuggestionClick }) => {
  const conversation = useSelector((store) => store.gpt.conversation);

  if (conversation.length === 0 && !isStreaming) {
    return (
      <div className="flex flex-col items-center text-center mt-12 sm:mt-20 px-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
            <path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z" />
          </svg>
        </div>
        <h2 className="text-white text-lg sm:text-xl font-semibold mb-1">
          What are you in the mood for?
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mb-6 max-w-md">
          Describe a vibe, a mood, or something you already love — I'll find real movies to match.
        </p>

        <div className="flex flex-wrap justify-center gap-2 max-w-xl">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestionClick?.(s)}
              className="text-xs sm:text-sm text-gray-200 bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-2 rounded-full transition"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pt-6">
      {conversation.map((turn, index) =>
        turn.role === "user" ? (
          <div key={index} className="flex justify-end">
            <div className="bg-red-600 text-white px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[85%] sm:max-w-[70%] text-sm sm:text-base shadow-lg">
              {turn.text}
            </div>
          </div>
        ) : (
          <div key={index} className="flex flex-col gap-3">
            <div className="flex justify-start items-end gap-2">
              <AiAvatar />
              <div className="bg-gray-800/90 text-white px-4 py-2.5 rounded-2xl rounded-bl-sm max-w-[85%] sm:max-w-[70%] text-sm sm:text-base shadow-lg">
                {turn.text}
              </div>
            </div>
            {turn.movies?.length > 0 && (
              <div className="-mx-4">
                <MovieList movies={toCardData(turn.movies)} />
              </div>
            )}
          </div>
        )
      )}

      {isStreaming && (
        <div className="flex justify-start items-end gap-2">
          <AiAvatar />
          <div className="bg-gray-800/90 text-white px-4 py-2.5 rounded-2xl rounded-bl-sm max-w-[85%] sm:max-w-[70%] text-sm sm:text-base min-h-[2.75rem] flex items-center shadow-lg">
            {streamingText || (
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GptChatWindow;