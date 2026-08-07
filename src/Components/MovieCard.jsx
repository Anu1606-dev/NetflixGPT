import React, { useRef, useState, useEffect } from 'react';
import useTitleLogo from '../hooks/useTitleLogo';

const MovieCard = ({ posterUrl, title, id, mediaType = "movie" }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!cardRef.current || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  const logoUrl = useTitleLogo(id, mediaType, isVisible);

  return (
    <div
      ref={cardRef}
      className="w-40 sm:w-56 md:w-64 lg:w-80 flex-shrink-0 mr-2 md:mr-3 cursor-pointer group/card"
    >
      <div className="relative aspect-video rounded-lg md:rounded-2xl overflow-hidden ring-1 ring-white/10 transition-transform duration-200 group-hover/card:scale-105 shadow-lg bg-gray-900">
        <img
          className="w-full h-full object-cover"
          src={posterUrl}
          alt={title || "movie card"}
        />

        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none"></div>

        <div className="absolute inset-x-0 bottom-0 px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4 flex items-end min-h-[2rem] sm:min-h-[2.5rem] md:min-h-[3rem]">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={title}
              className="max-h-8 sm:max-h-12 md:max-h-16 max-w-[85%] object-contain drop-shadow-lg"
            />
          ) : (
            title && (
              <p className="text-white text-sm sm:text-base md:text-xl font-bold drop-shadow-md leading-tight line-clamp-2">
                {title}
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;