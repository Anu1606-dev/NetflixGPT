import React from 'react';

const MovieCard = ({ posterUrl }) => {
  return (
    <div className="w-36 md:w-48 flex-shrink-0 mr-2 cursor-pointer transition duration-200 hover:scale-105">
      <img
        className="rounded-md w-full h-full object-cover"
        src={posterUrl}
        alt="movie card"
      />
    </div>
  );
};

export default MovieCard;