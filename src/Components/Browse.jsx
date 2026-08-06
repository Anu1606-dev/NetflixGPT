import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from './Header';
import MovieList from './MovieList';
import useNowPlayingMovies from '../hooks/useNowPlayingMovies';
import usePopularMovies from '../hooks/usePopularMovies';
import useTopRatedMovies from '../hooks/useTopRatedMovies';
import useUpcomingMovies from '../hooks/useUpcomingMovies';
import useMovieTrailer from '../hooks/useMovieTrailer';
import { IMG_CDN_URL, BACKDROP_CDN_URL } from '../Utils/constants';

const Browse = () => {
  const [isMuted, setIsMuted] = useState(true);

  useNowPlayingMovies();
  usePopularMovies();
  useTopRatedMovies();
  useUpcomingMovies();

  const nowPlayingMovies = useSelector((store) => store.movies.nowPlayingMovies);
  const popularMovies = useSelector((store) => store.movies.popularMovies);
  const topRatedMovies = useSelector((store) => store.movies.topRatedMovies);
  const upcomingMovies = useSelector((store) => store.movies.upcomingMovies);
  const trailerVideo = useSelector((store) => store.movies.trailerVideo);

  const mainMovie = nowPlayingMovies?.[0];
  useMovieTrailer(mainMovie?.id); // fetches trailer once mainMovie.id is known

  if (!nowPlayingMovies) return null;

  const toCardData = (movies) =>
    movies?.map((movie) => ({
      id: movie.id,
      image: IMG_CDN_URL + movie.poster_path,
    })) || [];

  return (
    <div className="relative bg-black min-h-screen">
      <Header showProfileIcon={true} />

      <div className="relative mx-2 md:mx-4 mt-2 rounded-2xl overflow-hidden h-[85vh]">
        {trailerVideo?.key ? (
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              className="absolute top-1/2 left-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${trailerVideo.key}&modestbranding=1&showinfo=0&rel=0`}
              title="trailer"
              allow="autoplay; encrypted-media"
              frameBorder="0"
            />
          </div>
        ) : (
          <img
            className="h-full w-full object-cover"
            src={BACKDROP_CDN_URL + mainMovie.backdrop_path}
            alt={mainMovie.title}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

        {/* Mute toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/40 bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
        >
          {isMuted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" />
              <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          )}
        </button>

        <div className="absolute bottom-16 md:bottom-20 left-6 md:left-12 w-full md:w-1/2 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-3 drop-shadow-lg">
            {mainMovie.title}
          </h1>

          <div className="flex items-center gap-2 text-sm md:text-base text-gray-200 mb-4">
            <span>Series</span>
            <span>•</span>
            <span>{mainMovie.genre_ids?.length ? "Drama" : ""}</span>
            <span>•</span>
            <span>{mainMovie.release_date?.slice(0, 4)}</span>
            <span>•</span>
            <span>{mainMovie.adult ? "A" : "U/A 13+"}</span>
          </div>

          <p className="text-sm md:text-base mb-4 text-gray-200 line-clamp-2 max-w-md">
            {mainMovie.overview}
          </p>

          <div className="flex gap-3">
            <button className="bg-white text-black px-6 py-2.5 rounded-full flex items-center gap-2 font-semibold hover:bg-gray-200 transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
              Play
            </button>
            <button className="bg-gray-500/50 text-white px-6 py-2.5 rounded-full flex items-center gap-2 font-semibold hover:bg-gray-500/70 transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              More Info
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 flex gap-2">
          <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full flex items-center gap-2">
            🍿 Looking for something new to watch?
          </span>
        </div>
      </div>

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