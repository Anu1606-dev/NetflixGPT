import React, { useState } from 'react';
import Header from './Header';
import MovieList from './MovieList';

const makeDummyRow = (seedPrefix) =>
  Array.from({ length: 10 }, (_, i) => ({
    id: `${seedPrefix}-${i}`,
    image: `https://picsum.photos/seed/${seedPrefix}${i}/400/225`,
  }));

const Browse = () => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative bg-black min-h-screen">
      <Header showProfileIcon={true} />

      {/* Hero banner — rounded card like the screenshot */}
      <div className="relative mx-2 md:mx-4 mt-2 rounded-2xl overflow-hidden h-[85vh]">
        <img
          className="h-full w-full object-cover"
          src="https://picsum.photos/seed/banner/1600/900"
          alt="featured"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

        {/* Small Netflix N badge, top-left of the banner itself */}
        <img
          className="absolute top-6 left-6 w-8"
          src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
          alt="N"
        />

        {/* Mute toggle, top-right */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-6 right-6 w-10 h-10 rounded-full border border-gray-400 bg-black/40 text-white flex items-center justify-center"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>

        <div className="absolute bottom-16 md:bottom-20 left-6 md:left-12 w-full md:w-1/2 text-white">
          <h1 className="text-4xl md:text-6xl font-bold italic font-serif mb-3 drop-shadow-lg">
            Dummy Movie Title
          </h1>

          <div className="flex items-center gap-2 text-sm md:text-base text-gray-200 mb-4">
            <span>Series</span>
            <span>•</span>
            <span>Drama</span>
            <span>•</span>
            <span>2026</span>
            <span>•</span>
            <span>8 Episodes</span>
            <span>•</span>
            <span className="border border-gray-400 px-1 text-xs">U/A 13+</span>
          </div>

          <div className="flex gap-3">
            <button className="bg-white text-black px-6 py-2 rounded flex items-center gap-2 font-semibold hover:bg-gray-200">
              ▶ Play
            </button>
            <button className="bg-gray-500/60 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold hover:bg-gray-500/80">
              ⓘ More Info
            </button>
          </div>
        </div>

        {/* Bottom-right badges */}
        <div className="absolute bottom-6 right-6 flex gap-2">
          <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
            📢 Watch in Hin, Eng, Tam, Tel
          </span>
          <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
            🔟 #1 in Shows
          </span>
        </div>
      </div>

      {/* Movie rows */}
      <div className="relative mt-4 z-10">
        <MovieList title="Trending Now" movies={makeDummyRow('trending')} />
        <MovieList title="Popular on Netflix" movies={makeDummyRow('popular')} />
        <MovieList title="Top Picks for You" movies={makeDummyRow('picks')} />
        <MovieList title="Continue Watching" movies={makeDummyRow('continue')} />
      </div>
    </div>
  );
};

export default Browse;