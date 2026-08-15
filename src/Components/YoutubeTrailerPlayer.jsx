import React, { useEffect, useRef } from 'react';

let apiLoadingPromise = null;

const loadYouTubeAPI = () => {
  if (window.YT && window.YT.Player) {
    return Promise.resolve();
  }
  if (apiLoadingPromise) return apiLoadingPromise;

  apiLoadingPromise = new Promise((resolve) => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => resolve();
  });

  return apiLoadingPromise;
};

const YoutubeTrailerPlayer = ({
  videoId,
  isMuted = true,
  controls = 0,       // 0 = background ambient trailer (hero banner), 1 = real player (watch modal)
  startSeconds = 0,   // resume position, only relevant when controls = 1
  onPlaying,
  onProgress,          // (currentTime, duration) => void — polled every 5s while playing
}) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    loadYouTubeAPI().then(() => {
      if (!isMounted || !containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          mute: isMuted ? 1 : 0,
          controls,
          loop: controls ? 0 : 1,
          playlist: controls ? undefined : videoId,
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
          iv_load_policy: 3,
          start: Math.floor(startSeconds || 0),
        },
        events: {
          onReady: () => {
            if (startSeconds) {
              playerRef.current.seekTo(startSeconds, true);
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              onPlaying?.();

              if (onProgress && !progressIntervalRef.current) {
                progressIntervalRef.current = setInterval(() => {
                  const current = playerRef.current?.getCurrentTime?.() || 0;
                  const duration = playerRef.current?.getDuration?.() || 0;
                  onProgress(current, duration);
                }, 5000);
              }
            } else if (
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.ENDED
            ) {
              if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
              }
              if (onProgress) {
                const current = playerRef.current?.getCurrentTime?.() || 0;
                const duration = playerRef.current?.getDuration?.() || 0;
                onProgress(current, duration);
              }
            }
          },
        },
      });
    });

    return () => {
      isMounted = false;
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [videoId]);

  useEffect(() => {
    if (playerRef.current?.mute && playerRef.current?.unMute) {
      isMuted ? playerRef.current.mute() : playerRef.current.unMute();
    }
  }, [isMuted]);

  return (
    <div
      ref={containerRef}
      className={controls ? "w-full h-full" : "w-full h-full pointer-events-none"}
    />
  );
};

export default YoutubeTrailerPlayer;