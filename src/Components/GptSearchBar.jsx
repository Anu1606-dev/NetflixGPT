import React, { useState, useEffect } from 'react';
import useVoiceSearch from '../hooks/useVoiceSearch';

const GptSearchBar = ({ onSearch, isSearching }) => {
  const [query, setQuery] = useState('');

  const {
    isSupported,
    isListening,
    transcript,
    finalTranscript,
    error: voiceError,
    startListening,
    stopListening,
    clearFinalTranscript,
  } = useVoiceSearch();

  // Show live speech-to-text in the input as the user talks
  useEffect(() => {
    if (isListening) {
      setQuery(transcript);
    }
  }, [transcript, isListening]);

  // Once the browser confirms a final transcript, auto-send it — no extra click needed
  useEffect(() => {
    if (finalTranscript.trim()) {
      onSearch(finalTranscript.trim());
      setQuery('');
      clearFinalTranscript();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTranscript]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isSearching) return;
    onSearch(trimmed);
    setQuery('');
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      setQuery('');
      startListening();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 bg-black/80 border border-gray-700 p-2 sm:p-3 rounded-full items-center"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            isListening
              ? "Listening..."
              : isSearching
              ? "Thinking..."
              : "Ask for a movie, mood, or vibe..."
          }
          disabled={isSearching}
          className="flex-1 px-4 py-2 rounded-full bg-transparent text-white text-sm sm:text-base outline-none disabled:opacity-50"
        />

        {isSupported && (
          <button
            type="button"
            onClick={handleMicClick}
            disabled={isSearching}
            aria-label={isListening ? "Stop listening" : "Search by voice"}
            className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full flex-shrink-0 transition disabled:opacity-50 ${
              isListening ? "bg-red-600 animate-pulse" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </button>
        )}

        <button
          type="submit"
          disabled={isSearching}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-semibold text-sm sm:text-base disabled:opacity-50 flex-shrink-0"
        >
          {isSearching ? "..." : "Send"}
        </button>
      </form>

      {voiceError && (
        <p className="text-red-500 text-xs sm:text-sm text-center mt-2">{voiceError}</p>
      )}
    </div>
  );
};

export default GptSearchBar;