import React, { useRef } from 'react';

const GptSearchBar = ({ onSearch, isSearching }) => {
  const searchText = useRef(null);

  const handleClick = () => {
    const query = searchText.current.value.trim();
    if (query) onSearch(query);
  };

  return (
    <div className="pt-32 sm:pt-40 flex justify-center px-4">
      <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-2 bg-black/60 p-3 sm:p-4 rounded-lg">
        <input
          ref={searchText}
          type="text"
          placeholder="What do you want to watch today?"
          className="flex-1 p-3 rounded bg-gray-800 border border-gray-600 text-white text-sm sm:text-base"
        />
        <button
          onClick={handleClick}
          disabled={isSearching}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-semibold disabled:opacity-50"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
};

export default GptSearchBar;