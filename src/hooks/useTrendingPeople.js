import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addTrendingPeople } from "../Utils/trendingSlice";

const useTrendingPeople = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      const data = await fetch(`${TMDB_BASE_URL}/trending/person/day`, API_OPTIONS);
      const json = await data.json();
      dispatch(addTrendingPeople(json.results));
    };
    getData();
  }, []);
};

export default useTrendingPeople;