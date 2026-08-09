import React from 'react';
import { useSelector } from 'react-redux';
import Header from './Header';
import MovieList from './MovieList';
import useTrendingAll from '../hooks/useTrendingAll';
import useUpcomingMovies from '../hooks/useUpcomingMovies';
import useAiringTodayTV from '../hooks/useAiringTodayTV';
import { toCardData } from '../Utils/toCardData';

const NewAndPopular = () => {
  useTrendingAll();
  useUpcomingMovies();
  useAiringTodayTV();

  const trendingAll = useSelector((store) => store.trending.trendingAll);
  const upcomingMovies = useSelector((store) => store.movies.upcomingMovies);
  const airingToday = useSelector((store) => store.tv.airingToday);

  return (
    <div className="relative bg-gradient-to-b from-[#1a0000] via-black to-black min-h-screen">
      <Header showProfileIcon={true} />
      <div className="pt-24 sm:pt-28 md:pt-32 pb-10">
        <h1 className="text-white text-xl sm:text-2xl font-bold px-4 sm:px-6 md:px-12 mb-4">
          New & Popular
        </h1>
        <MovieList title="Trending Today" movies={toCardData(trendingAll)} />
        <MovieList title="Coming Soon" movies={toCardData(upcomingMovies, "movie")} />
        <MovieList title="Airing Today" movies={toCardData(airingToday, "tv")} />
      </div>
    </div>
  );
};

export default NewAndPopular;