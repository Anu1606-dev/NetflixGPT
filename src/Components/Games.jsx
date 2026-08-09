import React from 'react';
import Header from './Header';

const Games = () => {
  return (
    <div className="relative bg-gradient-to-b from-[#1a0000] via-black to-black min-h-screen">
      <Header showProfileIcon={true} />
      <div className="pt-32 sm:pt-40 flex flex-col items-center text-center px-4">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-gray-500 mb-4"
        >
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M6 12h4M8 10v4M15 11h.01M18 13h.01" />
        </svg>
        <h1 className="text-white text-xl sm:text-2xl font-bold mb-2">Games Coming Soon</h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-md">
          This section is still in development.
        </p>
      </div>
    </div>
  );
};

export default Games;