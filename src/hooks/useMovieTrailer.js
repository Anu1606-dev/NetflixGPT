import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS } from "../Utils/constants";
import { addTrailerVideo } from "../Utils/moviesSlice";

const useMovieTrailer = (movieId) => {
  const dispatch = useDispatch();

  const getMovieVideos = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
      API_OPTIONS
    );
    const json = await data.json();

    // Prefer an official "Trailer" type video, fall back to the first available one
    const trailer =
      json.results.find((video) => video.type === "Trailer") || json.results[0];

    dispatch(addTrailerVideo(trailer || null));
  };

  useEffect(() => {
    if (movieId) getMovieVideos();
  }, [movieId]);
};

export default useMovieTrailer;