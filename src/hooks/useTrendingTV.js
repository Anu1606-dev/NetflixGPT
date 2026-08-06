import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addTrendingTV } from "../Utils/trendingSlice";

const useTrendingTV = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      const data = await fetch(`${TMDB_BASE_URL}/trending/tv/day`, API_OPTIONS);
      const json = await data.json();
      dispatch(addTrendingTV(json.results));
    };
    getData();
  }, []);
};

export default useTrendingTV;