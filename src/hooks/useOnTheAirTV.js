import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addOnTheAir } from "../Utils/tvSlice";

const useOnTheAirTV = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      const data = await fetch(`${TMDB_BASE_URL}/tv/on_the_air?page=1`, API_OPTIONS);
      const json = await data.json();
      dispatch(addOnTheAir(json.results));
    };
    getData();
  }, []);
};

export default useOnTheAirTV;