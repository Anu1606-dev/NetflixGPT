import React from 'react';
import { useSelector } from 'react-redux';
import Header from './Header';
import MovieList from './MovieList';
import useAiringTodayTV from '../hooks/useAiringTodayTV';
import useOnTheAirTV from '../hooks/useOnTheAirTV';
import usePopularTV from '../hooks/usePopularTV';
import useTopRatedTV from '../hooks/useTopRatedTV';
import useTrendingTV from '../hooks/useTrendingTV';
import { toCardData } from '../Utils/toCardData';

const Shows = () => {
  useAiringTodayTV();
  useOnTheAirTV();
  usePopularTV();
  useTopRatedTV();
  useTrendingTV();

  const airingToday = useSelector((store) => store.tv.airingToday);
  const onTheAir = useSelector((store) => store.tv.onTheAir);
  const popularTV = useSelector((store) => store.tv.popularTV);
  const topRatedTV = useSelector((store) => store.tv.topRatedTV);
  const trendingTV = useSelector((store) => store.trending.trendingTV);

  return (
    <div className="relative bg-gradient-to-b from-[#1a0000] via-black to-black min-h-screen">
      <Header showProfileIcon={true} />
      <div className="pt-24 sm:pt-28 md:pt-32 pb-10">
        <h1 className="text-white text-xl sm:text-2xl font-bold px-4 sm:px-6 md:px-12 mb-4">
          TV Shows
        </h1>
        <MovieList title="Airing Today" movies={toCardData(airingToday, "tv")} />
        <MovieList title="On The Air" movies={toCardData(onTheAir, "tv")} />
        <MovieList title="Popular TV Shows" movies={toCardData(popularTV, "tv")} />
        <MovieList title="Top Rated TV Shows" movies={toCardData(topRatedTV, "tv")} />
        <MovieList title="Trending TV Shows" movies={toCardData(trendingTV, "tv")} />
      </div>
    </div>
  );
};

export default Shows;