import React from 'react';
import { useSelector } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import MovieCard from './MovieCard';

const MyList = () => {
  const items = useSelector((store) => store.myList.items);

  return (
    <div className="relative bg-gradient-to-b from-[#1a0000] via-black to-black min-h-screen flex flex-col">
      <Header showProfileIcon={true} />

      <div className="flex-1 pt-24 sm:pt-28 md:pt-32 pb-16 px-4 sm:px-6 md:px-12">
        <h1 className="text-white text-xl sm:text-2xl font-bold mb-6">My List</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center text-center mt-16">
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
            <h2 className="text-white text-lg font-semibold mb-2">Your List is Empty</h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-md">
              Hover over any movie or show and click the + button to add it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {items.map((item) => (
              <MovieCard
                key={item.itemId}
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

      <Footer />
    </div>
  );
};

export default MyList;