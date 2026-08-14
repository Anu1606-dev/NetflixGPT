import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { setGenres } from "../Utils/searchSlice";

const useGenres = (): void => {
  const dispatch = useAppDispatch();
  const genres = useAppSelector((store) => store.search.genres);

  useEffect(() => {
    if (genres.movie && genres.tv) return;

    const getGenres = async (): Promise<void> => {
      try {
        const [movieRes, tvRes] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/genre/movie/list`, API_OPTIONS).then((r) => r.json()),
          fetch(`${TMDB_BASE_URL}/genre/tv/list`, API_OPTIONS).then((r) => r.json()),
        ]);
        dispatch(setGenres({ movie: movieRes.genres, tv: tvRes.genres }));
      } catch (err) {
        console.error("Failed to load genres:", err);
      }
    };
    getGenres();
  }, [dispatch, genres.movie, genres.tv]);
};

export default useGenres;