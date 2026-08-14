// Loosely-typed TMDB media item — covers both movies and TV shows.
// Fields are optional since TMDB's movie vs TV responses differ slightly.
export interface TMDBMedia {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  media_type?: "movie" | "tv" | "person";
  adult?: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface TrailerVideo {
  key: string;
  type: string;
  site: string;
}

export interface CastMember {
  name: string;
  character: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseYear: string | null;
  runtime: number;
  genres: string[];
  rating: number;
  trailerKey: string | null;
  cast: CastMember[];
}

export interface MyListItem {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  image: string;
  itemId: string;
  addedAt?: number | null;
}

export interface ContinueWatchingItem {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  image: string;
  itemId: string;
  progressSeconds: number;
  durationSeconds: number;
  updatedAt?: number | null;
}

export interface ConversationTurn {
  role: "user" | "assistant";
  text: string;
  image?: string | null;
  movies?: TMDBMedia[];
  movieDetail?: MovieDetail | null;
}