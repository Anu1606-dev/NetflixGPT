import React, { useState, useEffect, useRef } from 'react';
import useMovieSearch from '../hooks/useMovieSearch';
import MovieCard from './MovieCard';
import ImageSearchModal from './ImageSearchModal';

const SearchOverlay = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [showImageSearch, setShowImageSearch] = useState(false);
  const { search, results, isSearching, error, clearResults } = useMovieSearch();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !showImageSearch) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, showImageSearch]);

  useEffect(() => {
    if (!query.trim()) {
      clearResults();
      return;
    }
    const timer = setTimeout(() => {
      search(query);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-white/10 px-4 sm:px-6 md:px-12 py-4 flex items-center gap-3">
        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 flex-shrink-0">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, or try 'funny', 'action', 'scary'..."
            className="flex-1 bg-transparent text-white text-base sm:text-lg outline-none placeholder-gray-500"
          />
        </form>

        <button
          onClick={() => setShowImageSearch(true)}
          aria-label="Search by image"
          title="Identify a movie from a screenshot"
          className="text-gray-400 hover:text-white transition flex-shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </button>

        <button
          onClick={onClose}
          aria-label="Close search"
          className="text-gray-400 hover:text-white transition flex-shrink-0"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-4 sm:px-6 md:px-12 py-6">
        {!query.trim() && (
          <p className="text-gray-500 text-sm sm:text-base text-center mt-16">
            Start typing to search movies and TV shows, or use the image icon to identify one from a screenshot.
          </p>
        )}

        {isSearching && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-lg md:rounded-2xl bg-gray-800 animate-pulse"></div>
            ))}
          </div>
        )}

        {!isSearching && error && (
          <p className="text-red-500 text-sm sm:text-base text-center mt-16">{error}</p>
        )}

        {!isSearching && results && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {results.map((item) => (
              <MovieCard
                key={`${item.mediaType}-${item.id}`}
                id={item.id}
                mediaType={item.mediaType}
                posterUrl={item.image}
                title={item.title}
                layout="grid"
              />
            ))}
          </div>
        )}
      </div>

      {showImageSearch && (
        <ImageSearchModal onClose={() => setShowImageSearch(false)} />
      )}
    </div>
  );
};

export default SearchOverlay;