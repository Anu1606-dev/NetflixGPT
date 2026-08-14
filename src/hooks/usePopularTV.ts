import { useEffect } from "react";
import { useAppDispatch } from "./reduxHooks";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addPopularTV } from "../Utils/tvSlice";

const usePopularTV = (): void => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const data = await fetch(`${TMDB_BASE_URL}/tv/popular?page=1`, API_OPTIONS);
      const json = await data.json();
      dispatch(addPopularTV(json.results));
    };
    getData();
  }, [dispatch]);
};

export default usePopularTV;

