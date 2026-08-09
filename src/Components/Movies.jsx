import React from 'react';
import { useSelector } from 'react-redux';
import Header from './Header';
import MovieList from './MovieList';
import useNowPlayingMovies from '../hooks/useNowPlayingMovies';
import usePopularMovies from '../hooks/usePopularMovies';
import useTopRatedMovies from '../hooks/useTopRatedMovies';
import useUpcomingMovies from '../hooks/useUpcomingMovies';
import useTrendingMovies from '../hooks/useTrendingMovies';
import { toCardData } from '../Utils/toCardData';

const Movies = () => {
  useNowPlayingMovies();
  usePopularMovies();
  useTopRatedMovies();
  useUpcomingMovies();
  useTrendingMovies();

  const nowPlayingMovies = useSelector((store) => store.movies.nowPlayingMovies);
  const popularMovies = useSelector((store) => store.movies.popularMovies);
  const topRatedMovies = useSelector((store) => store.movies.topRatedMovies);
  const upcomingMovies = useSelector((store) => store.movies.upcomingMovies);
  const trendingMovies = useSelector((store) => store.trending.trendingMovies);

  return (
    <div className="relative bg-gradient-to-b from-[#1a0000] via-black to-black min-h-screen">
      <Header showProfileIcon={true} />
      <div className="pt-24 sm:pt-28 md:pt-32 pb-10">
        <h1 className="text-white text-xl sm:text-2xl font-bold px-4 sm:px-6 md:px-12 mb-4">
          Movies
        </h1>
        <MovieList title="Now Playing" movies={toCardData(nowPlayingMovies, "movie")} />
        <MovieList title="Popular Movies" movies={toCardData(popularMovies, "movie")} />
        <MovieList title="Top Rated Movies" movies={toCardData(topRatedMovies, "movie")} />
        <MovieList title="Upcoming Movies" movies={toCardData(upcomingMovies, "movie")} />
        <MovieList title="Trending Movies" movies={toCardData(trendingMovies, "movie")} />
      </div>
    </div>
  );
};

export default Movies;