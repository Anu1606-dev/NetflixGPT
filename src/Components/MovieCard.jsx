import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useTitleLogo from '../hooks/useTitleLogo';
import { addToMyList, removeFromMyList, getItemId } from '../Utils/firestoreList';

const MovieCard = ({ posterUrl, title, id, mediaType = "movie", layout = "row" }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const user = useSelector((store) => store.user);
  const myListItems = useSelector((store) => store.myList.items);

  const itemId = getItemId(mediaType, id);
  const isInList = myListItems.some((item) => item.itemId === itemId);

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

  const handleToggleList = async (e) => {
    e.stopPropagation();
    if (!user?.uid || isProcessing) return;

    setIsProcessing(true);
    try {
      if (isInList) {
        await removeFromMyList(user.uid, mediaType, id);
      } else {
        await addToMyList(user.uid, { id, mediaType, title, image: posterUrl });
      }
    } catch (err) {
      console.error("Failed to update My List:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const wrapperClass =
    layout === "grid"
      ? "w-full cursor-pointer group/card"
      : "w-40 sm:w-56 md:w-64 lg:w-80 flex-shrink-0 mr-2 md:mr-3 cursor-pointer group/card";

  return (
    <div ref={cardRef} className={wrapperClass}>
      <div className="relative aspect-video rounded-lg md:rounded-2xl overflow-hidden ring-1 ring-white/10 transition-transform duration-200 group-hover/card:scale-105 shadow-lg bg-gray-900">
        <img
          className="w-full h-full object-cover"
          src={posterUrl}
          alt={title || "movie card"}
        />

        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none"></div>

        {user && (
          <button
            onClick={handleToggleList}
            disabled={isProcessing}
            aria-label={isInList ? "Remove from My List" : "Add to My List"}
            className={`absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition opacity-0 group-hover/card:opacity-100 disabled:opacity-50 ${
              isInList ? "bg-white text-black" : "bg-black/60 text-white hover:bg-black/80"
            }`}
          >
            {isInList ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </button>
        )}

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