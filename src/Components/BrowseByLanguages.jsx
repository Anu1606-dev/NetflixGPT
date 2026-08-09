import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from './Header';
import MovieList from './MovieList';
import useDiscoverMoviesByLanguage from '../hooks/useDiscoverMoviesByLanguage';
import { toCardData } from '../Utils/toCardData';

const LANGUAGE_OPTIONS = [
  { label: "English", code: "en" },
  { label: "Hindi", code: "hi" },
];

const BrowseByLanguages = () => {
  const [activeLang, setActiveLang] = useState("en");
  useDiscoverMoviesByLanguage(activeLang);

  const movies = useSelector((store) => store.discover.languageMovies[activeLang]);
  const activeLabel = LANGUAGE_OPTIONS.find((l) => l.code === activeLang)?.label;

  return (
    <div className="relative bg-gradient-to-b from-[#1a0000] via-black to-black min-h-screen">
      <Header showProfileIcon={true} />
      <div className="pt-24 sm:pt-28 md:pt-32 pb-10">
        <h1 className="text-white text-xl sm:text-2xl font-bold px-4 sm:px-6 md:px-12 mb-4">
          Browse by Languages
        </h1>

        <div className="px-4 sm:px-6 md:px-12 flex gap-2 mb-6">
          {LANGUAGE_OPTIONS.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setActiveLang(lang.code)}
              className={
                activeLang === lang.code
                  ? "bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 px-4 py-1.5 rounded-full text-sm transition"
              }
            >
              {lang.label}
            </button>
          ))}
        </div>

        {movies ? (
          <MovieList title={`${activeLabel} Movies`} movies={toCardData(movies, "movie")} />
        ) : (
          <p className="text-gray-400 px-4 sm:px-6 md:px-12">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default BrowseByLanguages;