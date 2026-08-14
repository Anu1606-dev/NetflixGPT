import { useEffect } from "react";
import { useAppDispatch } from "./reduxHooks";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addTrendingAll } from "../Utils/trendingSlice";

const useTrendingAll = (): void => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const data = await fetch(`${TMDB_BASE_URL}/trending/all/day`, API_OPTIONS);
      const json = await data.json();
      dispatch(addTrendingAll(json.results));
    };
    getData();
  }, [dispatch]);
};

export default useTrendingAll;

