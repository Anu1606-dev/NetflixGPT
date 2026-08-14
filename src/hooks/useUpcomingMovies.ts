import { useCallback, useEffect } from "react";
import { useAppDispatch } from "./reduxHooks";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addUpcomingMovies } from "../Utils/moviesSlice";

const useUpcomingMovies = (): void => {
  const dispatch = useAppDispatch();

  const getUpcomingMovies = useCallback(async (): Promise<void> => {
    const data = await fetch(`${TMDB_BASE_URL}/movie/upcoming?page=1`, API_OPTIONS);
    const json = await data.json();
    dispatch(addUpcomingMovies(json.results));
  }, [dispatch]);

  useEffect(() => {
    getUpcomingMovies();
  }, [getUpcomingMovies]);
};

export default useUpcomingMovies;

