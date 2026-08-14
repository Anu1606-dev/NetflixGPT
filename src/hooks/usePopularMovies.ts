import { useEffect } from "react";
import { useAppDispatch } from "./reduxHooks";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addPopularMovies } from "../Utils/moviesSlice";

const usePopularMovies = (): void => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getPopularMovies = async (): Promise<void> => {
      const data = await fetch(`${TMDB_BASE_URL}/movie/popular?page=1`, API_OPTIONS);
      const json = await data.json();
      dispatch(addPopularMovies(json.results));
    };

    getPopularMovies();
  }, [dispatch]);
};

export default usePopularMovies;