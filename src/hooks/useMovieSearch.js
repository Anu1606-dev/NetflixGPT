import { useState } from "react";
import { useSelector } from "react-redux";
import { API_OPTIONS, TMDB_BASE_URL, IMG_CDN_URL, BACKDROP_CDN_URL } from "../Utils/constants";
import { GENRE_ALIASES } from "../Utils/genreAliases";

const toSearchCardData = (items) =>
  items
    .map((item) => ({
      id: item.id,
      image: item.backdrop_path
        ? BACKDROP_CDN_URL + item.backdrop_path
        : item.poster_path
        ? IMG_CDN_URL + item.poster_path
        : null,
      title: item.title || item.name,
      mediaType: item.media_type,
    }))
    .filter((item) => item.image && item.title);

const useMovieSearch = () => {
  const { movie: movieGenres, tv: tvGenres } = useSelector((store) => store.search.genres);
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const findGenreId = (genreList, matchTerms) => {
    if (!genreList) return null;
    const match = genreList.find((g) =>
      matchTerms.some(
        (term) =>
          g.name.toLowerCase().includes(term.toLowerCase()) ||
          term.toLowerCase().includes(g.name.toLowerCase())
      )
    );
    return match?.id || null;
  };

  const search = async (rawQuery) => {
    const query = rawQuery.trim();
    if (!query) {
      setResults(null);
      setError(null);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const normalized = query.toLowerCase();
      const matchTerms = GENRE_ALIASES[normalized] || [query];

      const movieGenreId = findGenreId(movieGenres, matchTerms);
      const tvGenreId = findGenreId(tvGenres, matchTerms);

      let combined = [];

      if (movieGenreId || tvGenreId) {
        // Keyword matched a genre — use discover endpoints
        const [movieRes, tvRes] = await Promise.all([
          movieGenreId
            ? fetch(
                `${TMDB_BASE_URL}/discover/movie?with_genres=${movieGenreId}&sort_by=popularity.desc`,
                API_OPTIONS
              ).then((r) => r.json())
            : Promise.resolve({ results: [] }),
          tvGenreId
            ? fetch(
                `${TMDB_BASE_URL}/discover/tv?with_genres=${tvGenreId}&sort_by=popularity.desc`,
                API_OPTIONS
              ).then((r) => r.json())
            : Promise.resolve({ results: [] }),
        ]);

        combined = [
          ...movieRes.results.map((m) => ({ ...m, media_type: "movie" })),
          ...tvRes.results.map((t) => ({ ...t, media_type: "tv" })),
        ];
      } else {
        // Normal text search — matches titles/names directly
        const res = await fetch(
          `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&page=1`,
          API_OPTIONS
        ).then((r) => r.json());

        combined = (res.results || []).filter(
          (r) => r.media_type === "movie" || r.media_type === "tv"
        );
      }

      combined.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      const cardData = toSearchCardData(combined);

      if (cardData.length === 0) {
        setError(`No results found for "${query}". Try a different search term.`);
        setResults([]);
      } else {
        setResults(cardData);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setError("Something went wrong while searching. Please try again.");
      setResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setError(null);
  };

  return { search, results, isSearching, error, clearResults };
};

export default useMovieSearch;