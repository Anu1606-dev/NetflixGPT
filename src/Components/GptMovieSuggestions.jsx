import React from 'react';
import { useSelector } from 'react-redux';
import MovieList from './MovieList';
import { IMG_CDN_URL } from '../Utils/constants';

const GptMovieSuggestions = () => {
  const gptMovieNames = useSelector((store) => store.gpt.gptMovieNames);
  const gptMovieResults = useSelector((store) => store.gpt.gptMovieResults);

  if (!gptMovieNames) return null;

  const toCardData = (movies) =>
    movies?.map((movie) => ({
      id: movie.id,
      image: IMG_CDN_URL + movie.poster_path,
      title: movie.title,
      mediaType: "movie",
    })) || [];

  return (
    <div className="pt-6">
      {gptMovieNames.map((name, index) => (
        <MovieList
          key={name + index}
          title={name}
          movies={toCardData(gptMovieResults[index])}
        />
      ))}
    </div>
  );
};

export default GptMovieSuggestions;