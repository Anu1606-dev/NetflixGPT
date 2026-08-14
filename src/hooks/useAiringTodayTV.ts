import { useEffect } from "react";
import { useAppDispatch } from "./reduxHooks";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addAiringToday } from "../Utils/tvSlice";

const useAiringTodayTV = (): void => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const data = await fetch(`${TMDB_BASE_URL}/tv/airing_today?page=1`, API_OPTIONS);
      const json = await data.json();
      dispatch(addAiringToday(json.results));
    };
    getData();
  }, [dispatch]);
};

export default useAiringTodayTV;