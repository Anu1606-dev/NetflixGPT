import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addAiringToday } from "../Utils/tvSlice";

const useAiringTodayTV = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      const data = await fetch(`${TMDB_BASE_URL}/tv/airing_today?page=1`, API_OPTIONS);
      const json = await data.json();
      dispatch(addAiringToday(json.results));
    };
    getData();
  }, []);
};

export default useAiringTodayTV;