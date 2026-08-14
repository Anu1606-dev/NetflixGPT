import { useCallback, useEffect } from "react";
import { useAppDispatch } from "./reduxHooks";
import { API_OPTIONS } from "../Utils/constants";
import { addNowPlayingMovies } from "../Utils/moviesSlice";

const useNowPlayingMovies = (): void => {
  const dispatch = useAppDispatch();

  const getNowPlayingMovies = useCallback(async (): Promise<void> => {
    const data = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing?page=1",
      API_OPTIONS
    );
    const json = await data.json();
    dispatch(addNowPlayingMovies(json.results));
  }, [dispatch]);

  useEffect(() => {
    getNowPlayingMovies();
  }, [getNowPlayingMovies]);
};

export default useNowPlayingMovies;