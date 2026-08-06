import { useDispatch } from "react-redux";
import { API_OPTIONS } from "../Utils/constants";
import { addMovieDetails } from "../Utils/moviesSlice";

const useMovieDetails = () => {
  const dispatch = useDispatch();

  const fetchMovieDetails = async (movieId) => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=videos,credits`,
      API_OPTIONS
    );
    const json = await data.json();
    dispatch(addMovieDetails(json));
  };

  return fetchMovieDetails; // returns a function you call manually with a movie id
};

export default useMovieDetails;