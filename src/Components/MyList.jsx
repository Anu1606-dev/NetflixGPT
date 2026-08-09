import React from 'react';
import Header from './Header';

const MyList = () => {
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
          <path d="M12 5v14M5 12h14" />
        </svg>
        <h1 className="text-white text-xl sm:text-2xl font-bold mb-2">Your List is Empty</h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-md">
          Movies and shows you add to My List will show up here.
        </p>
      </div>
    </div>
  );
};

export default MyList;