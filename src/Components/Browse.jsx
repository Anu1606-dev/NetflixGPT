import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Header from './Header';
import MovieList from './MovieList';
import YoutubeTrailerPlayer from './YoutubeTrailerPlayer';
import useNowPlayingMovies from '../hooks/useNowPlayingMovies';
import usePopularMovies from '../hooks/usePopularMovies';
import useTopRatedMovies from '../hooks/useTopRatedMovies';
import useUpcomingMovies from '../hooks/useUpcomingMovies';
import useMovieTrailer from '../hooks/useMovieTrailer';
import { IMG_CDN_URL, BACKDROP_CDN_URL } from '../Utils/constants';
import useTrendingAll from '../hooks/useTrendingAll';
import useTrendingMovies from '../hooks/useTrendingMovies';
import useTrendingPeople from '../hooks/useTrendingPeople';
import useTrendingTV from '../hooks/useTrendingTV';
import useAiringTodayTV from '../hooks/useAiringTodayTV';
import useOnTheAirTV from '../hooks/useOnTheAirTV';
import usePopularTV from '../hooks/usePopularTV';
import useTopRatedTV from '../hooks/useTopRatedTV';


const MIN_REVEAL_DELAY = 2500; // ms — safety buffer to hide YouTube's own buffering overlay
const MAX_REVEAL_DELAY = 5000; // ms — hard cap so it never gets stuck on the image

const Browse = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [mainMovie, setMainMovie] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  // Tracks whether both conditions (real "playing" event + min delay) have been met
  const playerConfirmedPlaying = useRef(false);
  const minTimeElapsed = useRef(false);

  useNowPlayingMovies();
  usePopularMovies();
  useTopRatedMovies();
  useUpcomingMovies();
  useTrendingAll();
  useTrendingMovies();
  useTrendingPeople();
  useTrendingTV();
  useAiringTodayTV();
  useOnTheAirTV();
  usePopularTV();
  useTopRatedTV();

  const nowPlayingMovies = useSelector((store) => store.movies.nowPlayingMovies);
  const popularMovies = useSelector((store) => store.movies.popularMovies);
  const topRatedMovies = useSelector((store) => store.movies.topRatedMovies);
  const upcomingMovies = useSelector((store) => store.movies.upcomingMovies);
  const trailerVideo = useSelector((store) => store.movies.trailerVideo);
  const trendingAll = useSelector((store) => store.trending.trendingAll);
  const trendingMovies = useSelector((store) => store.trending.trendingMovies);
  const trendingPeople = useSelector((store) => store.trending.trendingPeople);
  const trendingTV = useSelector((store) => store.trending.trendingTV);
  const airingToday = useSelector((store) => store.tv.airingToday);
  const onTheAir = useSelector((store) => store.tv.onTheAir);
  const popularTV = useSelector((store) => store.tv.popularTV);
  const topRatedTV = useSelector((store) => store.tv.topRatedTV);

  useEffect(() => {
    if (nowPlayingMovies && nowPlayingMovies.length > 0) {
      const randomIndex = Math.floor(Math.random() * nowPlayingMovies.length);
      setMainMovie(nowPlayingMovies[randomIndex]);
    }
  }, [nowPlayingMovies]);

  useMovieTrailer(mainMovie?.id);

  const tryReveal = () => {
    if (playerConfirmedPlaying.current && minTimeElapsed.current) {
      setShowVideo(true);
    }
  };

  useEffect(() => {
    setShowVideo(false);
    playerConfirmedPlaying.current = false;
    minTimeElapsed.current = false;

    if (!trailerVideo?.key) return;

    const minTimer = setTimeout(() => {
      minTimeElapsed.current = true;
      tryReveal();
    }, MIN_REVEAL_DELAY);

    const hardCapTimer = setTimeout(() => {
      setShowVideo(true); // force-reveal regardless, after the cap
    }, MAX_REVEAL_DELAY);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(hardCapTimer);
    };
  }, [trailerVideo]);

  const handlePlayerPlaying = () => {
    playerConfirmedPlaying.current = true;
    tryReveal();
  };

  if (!nowPlayingMovies || !mainMovie) return null;

  // defaultMediaType is used for single-type endpoints (Popular Movies, Top Rated TV, etc.)
  // item.media_type is used when present (trending/all mixes movies, TV, and people together)
  const toCardData = (items, defaultMediaType = "movie") =>
    items
      ?.filter((item) => item.media_type !== "person" && item.backdrop_path)
      .map((item) => ({
        id: item.id,
        image: BACKDROP_CDN_URL + item.backdrop_path,
        title: item.title || item.name, // movies use "title", TV shows use "name"
        mediaType: item.media_type || defaultMediaType,
      })) || [];

  const toPersonCardData = (people) =>
    people?.map((person) => ({
      id: person.id,
      image: person.profile_path ? IMG_CDN_URL + person.profile_path : null,
    })).filter((p) => p.image) || []; // skip people with no photo

  return (
    <div className="relative bg-black min-h-screen">
      <Header showProfileIcon={true} />

      <div className="relative mx-2 md:mx-4 mt-2 rounded-2xl overflow-hidden h-[85vh]">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={BACKDROP_CDN_URL + mainMovie.backdrop_path}
          alt={mainMovie.title}
        />

        {trailerVideo?.key && (
          <div
            className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ${showVideo ? "opacity-100" : "opacity-0"
              }`}
          >
            <div className="absolute top-1/2 left-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2">
              <YoutubeTrailerPlayer
                videoId={trailerVideo.key}
                isMuted={isMuted}
                onPlaying={handlePlayerPlaying}
              />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

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
      </div>

      <div className="relative mt-4 z-10">
        <MovieList title="Now Playing" movies={toCardData(nowPlayingMovies, "movie")} />
        <MovieList title="Popular on Netflix" movies={toCardData(popularMovies, "movie")} />
        <MovieList title="Top Rated" movies={toCardData(topRatedMovies, "movie")} />
        <MovieList title="Upcoming" movies={toCardData(upcomingMovies, "movie")} />

        <MovieList title="Trending Today" movies={toCardData(trendingAll)} />
        <MovieList title="Trending Movies" movies={toCardData(trendingMovies, "movie")} />
        <MovieList title="Trending TV Shows" movies={toCardData(trendingTV, "tv")} />
        <MovieList title="Airing Today" movies={toCardData(airingToday, "tv")} />
        <MovieList title="On The Air" movies={toCardData(onTheAir, "tv")} />
        <MovieList title="Popular TV Shows" movies={toCardData(popularTV, "tv")} />
        <MovieList title="Top Rated TV Shows" movies={toCardData(topRatedTV, "tv")} />
      </div>
    </div>
  );
};

export default Browse;