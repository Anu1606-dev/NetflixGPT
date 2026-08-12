import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import MovieList from './MovieList';
import Footer from './Footer';
import YoutubeTrailerPlayer from './YoutubeTrailerPlayer';
import MoviePlayerModal from './MoviePlayerModal';
import useNowPlayingMovies from '../hooks/useNowPlayingMovies';
import usePopularMovies from '../hooks/usePopularMovies';
import useTopRatedMovies from '../hooks/useTopRatedMovies';
import useUpcomingMovies from '../hooks/useUpcomingMovies';
import useMovieTrailer from '../hooks/useMovieTrailer';
import useTrendingAll from '../hooks/useTrendingAll';
import useTrendingMovies from '../hooks/useTrendingMovies';
import useTrendingTV from '../hooks/useTrendingTV';
import useAiringTodayTV from '../hooks/useAiringTodayTV';
import useOnTheAirTV from '../hooks/useOnTheAirTV';
import usePopularTV from '../hooks/usePopularTV';
import useTopRatedTV from '../hooks/useTopRatedTV';
import useGptChat from '../hooks/useGptChat';
import useChatImageSearch from '../hooks/useChatImageSearch';
import GptSearchBar from './GptSearchBar';
import GptChatWindow from './GptChatWindow';
import { resetConversation, toggleGptSearchView } from '../Utils/gptSlice';
import { BACKDROP_CDN_URL } from '../Utils/constants';

const MIN_REVEAL_DELAY = 2500;
const MAX_REVEAL_DELAY = 5000;

const Browse = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [mainMovie, setMainMovie] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [playingItem, setPlayingItem] = useState(null);

  const playerConfirmedPlaying = useRef(false);
  const minTimeElapsed = useRef(false);

  const dispatch = useDispatch();
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  const { sendMessage, isStreaming, streamingText } = useGptChat();
  const { sendImage, isProcessing: isImageProcessing } = useChatImageSearch();

  useNowPlayingMovies();
  usePopularMovies();
  useTopRatedMovies();
  useUpcomingMovies();
  useTrendingAll();
  useTrendingMovies();
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
  const trendingTV = useSelector((store) => store.trending.trendingTV);
  const airingToday = useSelector((store) => store.tv.airingToday);
  const onTheAir = useSelector((store) => store.tv.onTheAir);
  const popularTV = useSelector((store) => store.tv.popularTV);
  const topRatedTV = useSelector((store) => store.tv.topRatedTV);
  const continueWatchingItems = useSelector((store) => store.continueWatching.items);

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
      setShowVideo(true);
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

  // Opens the watch modal for any card — resumes from saved progress if this title
  // already exists in Continue Watching, otherwise starts from 0.
  const handleCardPlay = (movie) => {
    const itemId = `${movie.mediaType}_${movie.id}`;
    const existing = continueWatchingItems.find((cw) => cw.itemId === itemId);

    setPlayingItem({
      id: movie.id,
      mediaType: movie.mediaType,
      title: movie.title,
      image: movie.image,
      resumeSeconds: existing?.progressSeconds || 0,
    });
  };

  if (!nowPlayingMovies || !mainMovie) return null;

  const toCardData = (items, defaultMediaType = "movie") =>
    items
      ?.filter((item) => item.media_type !== "person" && item.backdrop_path)
      .map((item) => ({
        id: item.id,
        image: BACKDROP_CDN_URL + item.backdrop_path,
        title: item.title || item.name,
        mediaType: item.media_type || defaultMediaType,
      })) || [];

  const continueWatchingCardData = continueWatchingItems.map((item) => ({
    id: item.id,
    mediaType: item.mediaType,
    title: item.title,
    image: item.image,
    progress: item.durationSeconds ? (item.progressSeconds / item.durationSeconds) * 100 : 0,
  }));

  return (
    <div className="relative bg-black min-h-screen">
      <Header showProfileIcon={true} />

      {showGptSearch ? (
        <div className="relative min-h-screen bg-gradient-to-b from-[#1a0000] via-black to-black">
          <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 pt-20 sm:pt-24 pb-3 bg-black/70 backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center gap-3 text-white">
              <button
                onClick={() => dispatch(toggleGptSearchView())}
                className="flex items-center gap-1.5 bg-white text-black text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-gray-200 transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <div className="hidden sm:flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                  <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                </svg>
                <h1 className="text-sm sm:text-base font-semibold">AI Movie Assistant</h1>
              </div>
            </div>

            <button
              onClick={() => dispatch(resetConversation())}
              className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Clear chat
            </button>
          </div>

          <div className="max-w-3xl mx-auto px-4 pb-40">
            <GptChatWindow
              streamingText={streamingText}
              isStreaming={isStreaming}
              onSuggestionClick={sendMessage}
            />
          </div>

          <div className="fixed bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-10 pb-4 sm:pb-6 px-4 z-30">
            <GptSearchBar
              onSearch={sendMessage}
              onImageUpload={sendImage}
              isSearching={isStreaming || isImageProcessing}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="relative mx-2 md:mx-4 mt-2 rounded-xl md:rounded-2xl overflow-hidden h-[60vh] sm:h-[70vh] md:h-[85vh]">
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src={BACKDROP_CDN_URL + mainMovie.backdrop_path}
              alt={mainMovie.title}
            />

            {trailerVideo?.key && (
              <div
                className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ${
                  showVideo ? "opacity-100" : "opacity-0"
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
              className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/40 bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
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

            <div className="absolute bottom-8 sm:bottom-16 md:bottom-20 left-4 sm:left-6 md:left-12 w-[90%] sm:w-3/4 md:w-1/2 text-white">
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-3 drop-shadow-lg">
                {mainMovie.title}
              </h1>

              <div className="flex items-center gap-2 text-xs sm:text-sm md:text-base text-gray-200 mb-2 sm:mb-4">
                <span>Series</span>
                <span>•</span>
                <span>{mainMovie.release_date?.slice(0, 4)}</span>
                <span>•</span>
                <span>{mainMovie.adult ? "A" : "U/A 13+"}</span>
              </div>

              <p className="hidden sm:block text-sm md:text-base mb-3 md:mb-4 text-gray-200 line-clamp-2 max-w-md">
                {mainMovie.overview}
              </p>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() =>
                    handleCardPlay({
                      id: mainMovie.id,
                      mediaType: "movie",
                      title: mainMovie.title,
                      image: BACKDROP_CDN_URL + mainMovie.backdrop_path,
                    })
                  }
                  className="bg-white text-black px-4 sm:px-6 py-2 sm:py-2.5 rounded-full flex items-center gap-2 font-semibold hover:bg-gray-200 transition text-sm sm:text-base"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                  Play
                </button>
                <button className="bg-gray-500/50 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full flex items-center gap-2 font-semibold hover:bg-gray-500/70 transition text-sm sm:text-base">
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
            {continueWatchingCardData.length > 0 && (
              <MovieList
                title="Continue Watching"
                movies={continueWatchingCardData}
                onCardPlay={handleCardPlay}
              />
            )}
            <MovieList title="Now Playing" movies={toCardData(nowPlayingMovies, "movie")} onCardPlay={handleCardPlay} />
            <MovieList title="Popular on Netflix" movies={toCardData(popularMovies, "movie")} onCardPlay={handleCardPlay} />
            <MovieList title="Top Rated" movies={toCardData(topRatedMovies, "movie")} onCardPlay={handleCardPlay} />
            <MovieList title="Upcoming" movies={toCardData(upcomingMovies, "movie")} onCardPlay={handleCardPlay} />
            <MovieList title="Trending Today" movies={toCardData(trendingAll)} onCardPlay={handleCardPlay} />
            <MovieList title="Trending Movies" movies={toCardData(trendingMovies, "movie")} onCardPlay={handleCardPlay} />
            <MovieList title="Trending TV Shows" movies={toCardData(trendingTV, "tv")} onCardPlay={handleCardPlay} />
            <MovieList title="Airing Today" movies={toCardData(airingToday, "tv")} onCardPlay={handleCardPlay} />
            <MovieList title="On The Air" movies={toCardData(onTheAir, "tv")} onCardPlay={handleCardPlay} />
            <MovieList title="Popular TV Shows" movies={toCardData(popularTV, "tv")} onCardPlay={handleCardPlay} />
            <MovieList title="Top Rated TV Shows" movies={toCardData(topRatedTV, "tv")} onCardPlay={handleCardPlay} />
          </div>

          <Footer />
        </>
      )}

      {playingItem && (
        <MoviePlayerModal item={playingItem} onClose={() => setPlayingItem(null)} />
      )}
    </div>
  );
};

export default Browse;