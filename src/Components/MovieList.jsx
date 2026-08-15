import React, { useRef } from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ title, movies, onCardPlay }) => {
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
    <div className="px-3 sm:px-6 md:px-12 my-3 md:my-4 group relative">
      {title && (
        <h2 className="text-white text-base sm:text-lg md:text-xl font-semibold mb-2">
          {title}
        </h2>
      )}

      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="hidden md:flex md:opacity-0 md:group-hover:opacity-100 absolute left-0 top-1/2 mt-4 -translate-y-1/2 z-10 h-20 md:h-24 w-8 md:w-10 bg-black/50 hover:bg-black/80 text-white items-center justify-center text-xl md:text-2xl transition-opacity"
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
            progress={movie.progress}
            onPlay={onCardPlay ? () => onCardPlay(movie) : undefined}
          />
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="hidden md:flex md:opacity-0 md:group-hover:opacity-100 absolute right-0 top-1/2 mt-4 -translate-y-1/2 z-10 h-20 md:h-24 w-8 md:w-10 bg-black/50 hover:bg-black/80 text-white items-center justify-center text-xl md:text-2xl transition-opacity"
      >
        ›
      </button>
    </div>
  );
};

export default MovieList;