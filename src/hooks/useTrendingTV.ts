import { useEffect } from "react";
import { useAppDispatch } from "./reduxHooks";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addTrendingTV } from "../Utils/trendingSlice";

const useTrendingTV = (): void => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const data = await fetch(`${TMDB_BASE_URL}/trending/tv/day`, API_OPTIONS);
      const json = await data.json();
      dispatch(addTrendingTV(json.results));
    };
    getData();
  }, [dispatch]);
};

export default useTrendingTV;