import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addPopularTV } from "../Utils/tvSlice";

const usePopularTV = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      const data = await fetch(`${TMDB_BASE_URL}/tv/popular?page=1`, API_OPTIONS);
      const json = await data.json();
      dispatch(addPopularTV(json.results));
    };
    getData();
  }, []);
};

export default usePopularTV;