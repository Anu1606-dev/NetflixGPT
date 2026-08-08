import React, { useRef } from 'react';

const GptSearchBar = ({ onSearch, isSearching }) => {
  const searchText = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = searchText.current.value.trim();
    if (!query || isSearching) return;
    onSearch(query);
    searchText.current.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto flex gap-2 bg-black/80 border border-gray-700 p-2 sm:p-3 rounded-full"
    >
      <input
        ref={searchText}
        type="text"
        placeholder={isSearching ? "Thinking..." : "Ask for a movie, mood, or vibe..."}
        disabled={isSearching}
        className="flex-1 px-4 py-2 rounded-full bg-transparent text-white text-sm sm:text-base outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isSearching}
        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-semibold text-sm sm:text-base disabled:opacity-50"
      >
        {isSearching ? "..." : "Send"}
      </button>
    </form>
  );
};

export default GptSearchBar;