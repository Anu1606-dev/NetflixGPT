import { useCallback, useEffect } from "react";
import { useAppDispatch } from "./reduxHooks";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addTopRatedMovies } from "../Utils/moviesSlice";

const useTopRatedMovies = (): void => {
  const dispatch = useAppDispatch();

  const getTopRatedMovies = useCallback(async (): Promise<void> => {
    const data = await fetch(`${TMDB_BASE_URL}/movie/top_rated?page=1`, API_OPTIONS);
    const json = await data.json();
    dispatch(addTopRatedMovies(json.results));
  }, [dispatch]);

  useEffect(() => {
    getTopRatedMovies();
  }, [getTopRatedMovies]);
};

export default useTopRatedMovies;

