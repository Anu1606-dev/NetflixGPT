import { useEffect } from "react";
import { useAppDispatch } from "./reduxHooks";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addTopRatedTV } from "../Utils/tvSlice";

const useTopRatedTV = (): void => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const data = await fetch(`${TMDB_BASE_URL}/tv/top_rated?page=1`, API_OPTIONS);
      const json = await data.json();
      dispatch(addTopRatedTV(json.results));
    };
    getData();
  }, [dispatch]);
};

export default useTopRatedTV;