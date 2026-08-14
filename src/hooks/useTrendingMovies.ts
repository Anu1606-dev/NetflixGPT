import { useEffect } from "react";
import { useAppDispatch } from "./reduxHooks";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addTrendingMovies } from "../Utils/trendingSlice";

const useTrendingMovies = (): void => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const data = await fetch(`${TMDB_BASE_URL}/trending/movie/day`, API_OPTIONS);
      const json = await data.json();
      dispatch(addTrendingMovies(json.results));
    };
    getData();
  }, [dispatch]);
};

export default useTrendingMovies;