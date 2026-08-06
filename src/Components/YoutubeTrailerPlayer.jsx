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

const YoutubeTrailerPlayer = ({ videoId, isMuted, onPlaying }) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

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
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: videoId,
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              onPlaying?.();
            }
          },
        },
      });
    });

    return () => {
      isMounted = false;
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  useEffect(() => {
    if (playerRef.current?.mute && playerRef.current?.unMute) {
      isMuted ? playerRef.current.mute() : playerRef.current.unMute();
    }
  }, [isMuted]);

  return <div ref={containerRef} className="w-full h-full pointer-events-none" />;
};

export default YoutubeTrailerPlayer;