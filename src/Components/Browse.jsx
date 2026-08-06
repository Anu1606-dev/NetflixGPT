import React from 'react';
import { useSelector } from 'react-redux';
import Header from './Header';
import MovieList from './MovieList';
import useNowPlayingMovies from '../hooks/useNowPlayingMovies';
import usePopularMovies from '../hooks/usePopularMovies';
import useTopRatedMovies from '../hooks/useTopRatedMovies';
import useUpcomingMovies from '../hooks/useUpcomingMovies';
import { IMG_CDN_URL, BACKDROP_CDN_URL } from '../Utils/constants';

const Browse = () => {
  useNowPlayingMovies();
  usePopularMovies();
  useTopRatedMovies();
  useUpcomingMovies();

  const nowPlayingMovies = useSelector((store) => store.movies.nowPlayingMovies);
  const popularMovies = useSelector((store) => store.movies.popularMovies);
  const topRatedMovies = useSelector((store) => store.movies.topRatedMovies);
  const upcomingMovies = useSelector((store) => store.movies.upcomingMovies);

  // Wait until the hero movie's data is ready before rendering
  if (!nowPlayingMovies) return null;

  const mainMovie = nowPlayingMovies[0];

  // Helper to reshape TMDB's movie objects into { id, image } for MovieCard
  const toCardData = (movies) =>
    movies?.map((movie) => ({
      id: movie.id,
      image: IMG_CDN_URL + movie.poster_path,
    })) || [];

  return (
    <div className="relative bg-black min-h-screen">
      <Header showProfileIcon={true} />

      {/* Hero banner — now using the higher-res backdrop size */}
      <div className="relative mx-2 md:mx-4 mt-2 rounded-2xl overflow-hidden h-[85vh]">
        <img
          className="h-full w-full object-cover"
          src={BACKDROP_CDN_URL + mainMovie.backdrop_path}
          alt={mainMovie.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

        <div className="absolute bottom-16 md:bottom-20 left-6 md:left-12 w-full md:w-1/2 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-3 drop-shadow-lg">
            {mainMovie.title}
          </h1>
          <p className="text-sm md:text-base mb-4 text-gray-200 line-clamp-3">
            {mainMovie.overview}
          </p>
          <div className="flex gap-3">
            <button className="bg-white text-black px-6 py-2 rounded flex items-center gap-2 font-semibold hover:bg-gray-200">
              ▶ Play
            </button>
            <button className="bg-gray-500/60 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold hover:bg-gray-500/80">
              ⓘ More Info
            </button>
          </div>
        </div>
      </div>

      {/* All movie rows using real TMDB data */}
      <div className="relative mt-4 z-10">
        <MovieList title="Now Playing" movies={toCardData(nowPlayingMovies)} />
        <MovieList title="Popular on Netflix" movies={toCardData(popularMovies)} />
        <MovieList title="Top Rated" movies={toCardData(topRatedMovies)} />
        <MovieList title="Upcoming" movies={toCardData(upcomingMovies)} />
      </div>
    </div>
  );
};

export default Browse;