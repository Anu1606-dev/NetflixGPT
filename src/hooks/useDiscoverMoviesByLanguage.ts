import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { API_OPTIONS, TMDB_BASE_URL } from "../Utils/constants";
import { addLanguageMovies } from "../Utils/discoverSlice";

const useDiscoverMoviesByLanguage = (langCode: string): void => {
  const dispatch = useAppDispatch();
  const cached = useAppSelector((store) => store.discover.languageMovies[langCode]);

  useEffect(() => {
    if (cached || !langCode) return;

    const getData = async (): Promise<void> => {
      const data = await fetch(
        `${TMDB_BASE_URL}/discover/movie?with_original_language=${langCode}&sort_by=popularity.desc&page=1`,
        API_OPTIONS
      );
      const json = await data.json();
      dispatch(addLanguageMovies({ langCode, movies: json.results }));
    };
    getData();
  }, [cached, dispatch, langCode]);
};

export default useDiscoverMoviesByLanguage;