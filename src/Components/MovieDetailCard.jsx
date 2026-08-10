import React, { useState } from 'react';
import { BACKDROP_CDN_URL, IMG_CDN_URL } from '../Utils/constants';

const MovieDetailCard = ({ detail }) => {
  const [showTrailer, setShowTrailer] = useState(false);

  if (!detail) {
    return (
      <div className="bg-gray-800/90 text-gray-400 text-sm rounded-2xl p-4 max-w-[85%] sm:max-w-[70%]">
        Sorry, I couldn't find details for that title.
      </div>
    );
  }

  const previewImage = detail.backdropPath
    ? BACKDROP_CDN_URL + detail.backdropPath
    : detail.posterPath
    ? IMG_CDN_URL + detail.posterPath
    : null;

  return (
    <div className="bg-gray-800/90 rounded-2xl overflow-hidden max-w-[90%] sm:max-w-[75%] shadow-lg">
      <div className="relative aspect-video bg-black">
        {showTrailer && detail.trailerKey ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${detail.trailerKey}?autoplay=1`}
            title={detail.title}
            allow="autoplay; encrypted-media"
            allowFullScreen
            frameBorder="0"
          />
        ) : (
          <>
            {previewImage && (
              <img
                className="w-full h-full object-cover"
                src={previewImage}
                alt={detail.title}
              />
            )}
            {detail.trailerKey && (
              <button
                onClick={() => setShowTrailer(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition"
                aria-label="Play trailer"
              >
                <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                </span>
              </button>
            )}
          </>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="text-white font-bold text-base sm:text-lg mb-1">{detail.title}</h3>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300 mb-2">
          {detail.releaseYear && <span>{detail.releaseYear}</span>}
          {detail.runtime > 0 && (
            <>
              <span>•</span>
              <span>{detail.runtime} min</span>
            </>
          )}
          {detail.rating > 0 && (
            <>
              <span>•</span>
              <span>⭐ {detail.rating.toFixed(1)}</span>
            </>
          )}
        </div>

        {detail.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {detail.genres.map((g) => (
              <span key={g} className="text-[11px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                {g}
              </span>
            ))}
          </div>
        )}

        {detail.overview && (
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-4 mb-3">
            {detail.overview}
          </p>
        )}

        {detail.cast.length > 0 && (
          <div>
            <p className="text-gray-400 text-xs font-semibold mb-1">Cast</p>
            <p className="text-gray-300 text-xs leading-relaxed">
              {detail.cast.map((c) => c.name).join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailCard;