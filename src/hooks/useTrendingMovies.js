import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addTrendingMovies } from "../Utils/trendingSlice";

const useTrendingMovies = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      const data = await fetch(`${TMDB_BASE_URL}/trending/movie/day`, API_OPTIONS);
      const json = await data.json();
      dispatch(addTrendingMovies(json.results));
    };
    getData();
  }, []);
};

export default useTrendingMovies;