import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addLanguageMovies } from "../Utils/discoverSlice";

const useDiscoverMoviesByLanguage = (langCode) => {
  const dispatch = useDispatch();
  const cached = useSelector((store) => store.discover.languageMovies[langCode]);

  useEffect(() => {
    if (cached || !langCode) return; // skip if already fetched

    const getData = async () => {
      const data = await fetch(
        `${TMDB_BASE_URL}/discover/movie?with_original_language=${langCode}&sort_by=popularity.desc&page=1`,
        API_OPTIONS
      );
      const json = await data.json();
      dispatch(addLanguageMovies({ langCode, movies: json.results }));
    };
    getData();
  }, [langCode]);
};

export default useDiscoverMoviesByLanguage;