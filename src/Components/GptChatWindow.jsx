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

const GptChatWindow = ({ streamingText, isStreaming }) => {
  const conversation = useSelector((store) => store.gpt.conversation);

  if (conversation.length === 0 && !isStreaming) {
    return (
      <div className="text-center text-gray-400 mt-16 sm:mt-24 px-4">
        <p className="text-base sm:text-lg">Tell me what you're in the mood for.</p>
        <p className="text-sm mt-2">
          Try: "something like Inception but shorter" or "movies for a rainy day"
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {conversation.map((turn, index) =>
        turn.role === "user" ? (
          <div key={index} className="flex justify-end">
            <div className="bg-red-600 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[85%] sm:max-w-[70%] text-sm sm:text-base">
              {turn.text}
            </div>
          </div>
        ) : (
          <div key={index} className="flex flex-col gap-3">
            <div className="flex justify-start">
              <div className="bg-gray-800 text-white px-4 py-2 rounded-2xl rounded-bl-sm max-w-[85%] sm:max-w-[70%] text-sm sm:text-base">
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
        <div className="flex justify-start">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-2xl rounded-bl-sm max-w-[85%] sm:max-w-[70%] text-sm sm:text-base min-h-[2.5rem] flex items-center">
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