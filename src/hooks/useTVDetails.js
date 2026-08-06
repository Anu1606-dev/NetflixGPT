import { useDispatch } from "react-redux";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addTVDetails } from "../Utils/tvSlice";

const useTVDetails = () => {
  const dispatch = useDispatch();

  const fetchTVDetails = async (tvId) => {
    const data = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}?append_to_response=videos,credits`,
      API_OPTIONS
    );
    const json = await data.json();
    dispatch(addTVDetails(json));
  };

  return fetchTVDetails;
};

export default useTVDetails;