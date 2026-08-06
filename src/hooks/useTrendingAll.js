import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addTrendingAll } from "../Utils/trendingSlice";

const useTrendingAll = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      const data = await fetch(`${TMDB_BASE_URL}/trending/all/day`, API_OPTIONS);
      const json = await data.json();
      dispatch(addTrendingAll(json.results));
    };
    getData();
  }, []);
};

export default useTrendingAll;