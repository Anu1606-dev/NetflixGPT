import { useEffect } from "react";
import { useAppDispatch } from "./reduxHooks";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addOnTheAir } from "../Utils/tvSlice";

const useOnTheAirTV = (): void => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const data = await fetch(`${TMDB_BASE_URL}/tv/on_the_air?page=1`, API_OPTIONS);
      const json = await data.json();
      dispatch(addOnTheAir(json.results));
    };
    getData();
  }, [dispatch]);
};

export default useOnTheAirTV;