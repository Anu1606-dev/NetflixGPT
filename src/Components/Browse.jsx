import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import MovieList from './MovieList';
import useNowPlayingMovies from '../hooks/useNowPlayingMovies';
import { IMG_CDN_URL } from '../Utils/constants';

const Browse = () => {
  const navigate = useNavigate(); // lets us redirect programmatically
  const user = useSelector((store) => store.user); // read the logged-in user from Redux

  // Runs once when this component loads, and again if `user` ever changes
  useEffect(() => {
    if (!user) {
      navigate("/login"); // no user found → kick them to the login page
    }
  }, [user]);

  useNowPlayingMovies();

  const nowPlayingMovies = useSelector((store) => store.movies.nowPlayingMovies);

  if (!nowPlayingMovies) return null;

  const mainMovie = nowPlayingMovies[0];

  return (
    <div className="relative bg-black min-h-screen">
      <Header showProfileIcon={true} />

      <div className="relative mx-2 md:mx-4 mt-2 rounded-2xl overflow-hidden h-[85vh]">
        <img
          className="h-full w-full object-cover"
          src={IMG_CDN_URL + mainMovie.backdrop_path}
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

      <div className="relative mt-4 z-10">
        <MovieList
          title="Now Playing"
          movies={nowPlayingMovies.map((movie) => ({
            id: movie.id,
            image: IMG_CDN_URL + movie.poster_path,
          }))}
        />
      </div>
    </div>
  );
};

export default Browse;