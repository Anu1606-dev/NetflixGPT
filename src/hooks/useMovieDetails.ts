import { useAppDispatch } from "./reduxHooks";
import { API_OPTIONS } from "../Utils/constants";
import { addMovieDetails } from "../Utils/moviesSlice";

const useMovieDetails = (): ((movieId: number) => Promise<void>) => {
  const dispatch = useAppDispatch();

  const fetchMovieDetails = async (movieId: number): Promise<void> => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=videos,credits`,
      API_OPTIONS
    );
    const json = await data.json();
    dispatch(addMovieDetails(json));
  };

  return fetchMovieDetails;
};

export default useMovieDetails;

