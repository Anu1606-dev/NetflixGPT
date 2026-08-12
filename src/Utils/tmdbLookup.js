import { API_OPTIONS, TMDB_BASE_URL } from "./constants";

export const searchTMDBMulti = async (title, signal) => {
  const data = await fetch(
    `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(title)}&page=1`,
    { ...API_OPTIONS, signal }
  );
  const json = await data.json();
  return (
    (json.results || []).find(
      (r) => r.media_type === "movie" || r.media_type === "tv"
    ) || null
  );
};

export const getMediaDetails = async (match, signal) => {
  const endpoint = match.media_type === "tv" ? "tv" : "movie";
  const data = await fetch(
    `${TMDB_BASE_URL}/${endpoint}/${match.id}?append_to_response=videos,credits`,
    { ...API_OPTIONS, signal }
  );
  const details = await data.json();

  const trailer =
    details.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
    details.videos?.results?.[0] ||
    null;

  return {
    id: details.id,
    title: details.title || details.name,
    overview: details.overview,
    posterPath: details.poster_path,
    backdropPath: details.backdrop_path,
    releaseYear: (details.release_date || details.first_air_date || "").slice(0, 4) || null,
    runtime: details.runtime || details.episode_run_time?.[0] || 0,
    genres: details.genres?.map((g) => g.name) || [],
    rating: details.vote_average || 0,
    trailerKey: trailer?.key || null,
    cast: (details.credits?.cast || []).slice(0, 5).map((c) => ({
      name: c.name,
      character: c.character,
    })),
  };
};