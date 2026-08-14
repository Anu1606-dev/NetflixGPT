import { useCallback, useEffect } from "react";
import { useAppDispatch } from "./reduxHooks";
import { API_OPTIONS } from "../Utils/constants";
import { addTrailerVideo } from "../Utils/moviesSlice";

const useMovieTrailer = (movieId: number | undefined): void => {
  const dispatch = useAppDispatch();

  const getMovieVideos = useCallback(async (): Promise<void> => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
      API_OPTIONS
    );
    const json = await data.json();

    const trailer =
      json.results.find((video: any) => video.type === "Trailer") || json.results[0];

    dispatch(addTrailerVideo(trailer || null));
  }, [dispatch, movieId]);

  useEffect(() => {
    if (movieId) getMovieVideos();
  }, [movieId, getMovieVideos]);
};

export default useMovieTrailer;