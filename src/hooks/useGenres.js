import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { setGenres } from "../Utils/searchSlice";

// Fetches TMDB's official genre lists once and caches them in Redux.
const useGenres = () => {
  const dispatch = useDispatch();
  const genres = useSelector((store) => store.search.genres);

  useEffect(() => {
    if (genres.movie && genres.tv) return; // already cached, skip refetching

    const getGenres = async () => {
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
  }, []);
};

export default useGenres;