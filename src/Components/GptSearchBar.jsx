import React, { useState, useEffect, useRef } from 'react';
import useVoiceSearch from '../hooks/useVoiceSearch';

const GptSearchBar = ({ onSearch, onImageUpload, isSearching }) => {
  const [query, setQuery] = useState('');
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    if (isListening) {
      setQuery(transcript);
    }
  }, [transcript, isListening]);

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

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload?.(file);
    }
    e.target.value = '';
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex gap-1 sm:gap-2 bg-black/80 border border-gray-700 pl-3 pr-1.5 py-1.5 sm:p-3 rounded-full items-center"
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
              : "Ask, upload, or speak..."
          }
          disabled={isSearching}
          className="flex-1 min-w-0 px-1 sm:px-3 py-2 rounded-full bg-transparent text-white text-sm sm:text-base outline-none disabled:opacity-50"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSearching}
          aria-label="Identify from image"
          title="Upload a screenshot to identify"
          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex-shrink-0 transition disabled:opacity-50"
        >
          <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </button>

        {isSupported && (
          <button
            type="button"
            onClick={handleMicClick}
            disabled={isSearching}
            aria-label={isListening ? "Stop listening" : "Search by voice"}
            className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 transition disabled:opacity-50 ${
              isListening ? "bg-red-600 animate-pulse" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </button>
        )}

        <button
          type="submit"
          disabled={isSearching}
          aria-label="Send"
          className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center w-8 h-8 sm:w-auto sm:px-5 sm:py-2 rounded-full font-semibold text-sm sm:text-base disabled:opacity-50 flex-shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white" className="sm:hidden">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
          <span className="hidden sm:inline">{isSearching ? "..." : "Send"}</span>
        </button>
      </form>

      {voiceError && (
        <p className="text-red-500 text-xs sm:text-sm text-center mt-2">{voiceError}</p>
      )}
    </div>
  );
};

export default GptSearchBar;