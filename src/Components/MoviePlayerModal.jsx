import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { API_OPTIONS, TMDB_BASE_URL } from '../Utils/constants';
import { saveWatchProgress, removeWatchProgress } from '../Utils/firestoreProgress';
import YoutubeTrailerPlayer from './YoutubeTrailerPlayer';

const COMPLETE_THRESHOLD = 0.9; // 90%+ watched = considered finished, drops off Continue Watching

const MoviePlayerModal = ({ item, onClose }) => {
  const user = useSelector((store) => store.user);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const latestProgress = useRef({ current: item.resumeSeconds || 0, duration: 0 });

  useEffect(() => {
    let isMounted = true;
    const fetchTrailer = async () => {
      const endpoint = item.mediaType === "tv" ? "tv" : "movie";
      const data = await fetch(
        `${TMDB_BASE_URL}/${endpoint}/${item.id}/videos?language=en-US`,
        API_OPTIONS
      );
      const json = await data.json();
      const trailer =
        json.results?.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
        json.results?.[0] ||
        null;
      if (isMounted) {
        setTrailerKey(trailer?.key || null);
        setIsLoading(false);
      }
    };
    fetchTrailer();
    return () => { isMounted = false; };
  }, [item.id, item.mediaType]);

  const persistProgress = async (currentTime, duration) => {
    latestProgress.current = { current: currentTime, duration };
    if (!user?.uid || !duration) return;

    const fractionWatched = currentTime / duration;

    if (fractionWatched >= COMPLETE_THRESHOLD) {
      await removeWatchProgress(user.uid, item.mediaType, item.id);
    } else {
      await saveWatchProgress(user.uid, item, currentTime, duration);
    }
  };

  const handleClose = () => {
    const { current, duration } = latestProgress.current;
    if (duration > 0) {
      persistProgress(current, duration);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black z-[70] flex flex-col">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-black">
        <h2 className="text-white text-sm sm:text-base font-semibold truncate pr-4">
          {item.title}
        </h2>
        <button
          onClick={handleClose}
          aria-label="Close player"
          className="text-gray-400 hover:text-white transition flex-shrink-0"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 relative bg-black flex items-center justify-center">
        {isLoading && <p className="text-gray-400 text-sm">Loading trailer...</p>}

        {!isLoading && !trailerKey && (
          <p className="text-gray-400 text-sm px-4 text-center">
            No trailer available for this title.
          </p>
        )}

        {!isLoading && trailerKey && (
          <div className="w-full h-full max-w-5xl aspect-video mx-auto">
            <YoutubeTrailerPlayer
              videoId={trailerKey}
              isMuted={false}
              controls={1}
              startSeconds={item.resumeSeconds || 0}
              onProgress={persistProgress}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviePlayerModal;