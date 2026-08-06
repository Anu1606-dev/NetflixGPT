import React, { useRef } from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ title, movies }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="px-4 md:px-12 my-4 group relative">
      <h2 className="text-white text-lg md:text-xl font-semibold mb-2">
        {title}
      </h2>

      {/* Left arrow - shows on hover over the row */}
      <button
        onClick={() => scroll("left")}
        className="hidden group-hover:flex absolute left-0 top-1/2 mt-4 -translate-y-1/2 z-10 h-24 w-10 bg-black/50 hover:bg-black/80 text-white items-center justify-center text-2xl"
      >
        ‹
      </button>

      <div
        ref={scrollRef}
        className="flex overflow-x-scroll no-scrollbar scroll-smooth"
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            mediaType={movie.mediaType}
            posterUrl={movie.image}
            title={movie.title}
          />
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className="hidden group-hover:flex absolute right-0 top-1/2 mt-4 -translate-y-1/2 z-10 h-24 w-10 bg-black/50 hover:bg-black/80 text-white items-center justify-center text-2xl"
      >
        ›
      </button>
    </div>
  );
};

export default MovieList;