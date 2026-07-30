import React from 'react';
import Header from './Header';
import MovieList from './MovieList';

// Dummy data for now — same shape (id + image) as what TMDB will give you later
const makeDummyRow = (seedPrefix) =>
  Array.from({ length: 10 }, (_, i) => ({
    id: `${seedPrefix}-${i}`,
    image: `https://picsum.photos/seed/${seedPrefix}${i}/400/225`,
  }));

const Browse = () => {
  return (
    <div className="relative bg-black min-h-screen">
      <Header showProfileIcon={true} />

      {/* Hero banner */}
      <div className="relative h-screen w-full">
        <img
          className="h-full w-full object-cover"
          src="https://picsum.photos/seed/banner/1600/900"
          alt="featured"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

        <div className="absolute bottom-1/4 px-8 md:px-12 w-full md:w-1/2 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Dummy Movie Title
          </h1>
          <p className="text-sm md:text-base mb-4 line-clamp-3 text-gray-200">
            This is a placeholder description for the featured title. You'll
            replace this with real data once the TMDB API step is covered.
          </p>
          <div className="flex gap-3">
            <button className="bg-white text-black px-6 py-2 rounded font-semibold flex items-center gap-2">
              ▶ Play
            </button>
            <button className="bg-gray-500/70 text-white px-6 py-2 rounded font-semibold flex items-center gap-2">
              ⓘ More Info
            </button>
          </div>
        </div>
      </div>

      {/* Movie rows — pulled up to overlap the banner, like real Netflix */}
      <div className="relative -mt-32 md:-mt-48 z-10">
        <MovieList title="Trending Now" movies={makeDummyRow('trending')} />
        <MovieList title="Popular on Netflix" movies={makeDummyRow('popular')} />
        <MovieList title="Top Picks for You" movies={makeDummyRow('picks')} />
        <MovieList title="Continue Watching" movies={makeDummyRow('continue')} />
      </div>
    </div>
  );
};

export default Browse;