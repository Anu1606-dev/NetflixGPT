import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TMDBMedia, TrailerVideo, MovieDetail } from "./types";

interface MoviesState {
  nowPlayingMovies: TMDBMedia[] | null;
  popularMovies: TMDBMedia[] | null;
  topRatedMovies: TMDBMedia[] | null;
  upcomingMovies: TMDBMedia[] | null;
  movieDetails: MovieDetail | null;
  trailerVideo: TrailerVideo | null;
}

const initialState: MoviesState = {
  nowPlayingMovies: null,
  popularMovies: null,
  topRatedMovies: null,
  upcomingMovies: null,
  movieDetails: null,
  trailerVideo: null,
};

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    addNowPlayingMovies: (state, action: PayloadAction<TMDBMedia[]>) => {
      state.nowPlayingMovies = action.payload;
    },
    addPopularMovies: (state, action: PayloadAction<TMDBMedia[]>) => {
      state.popularMovies = action.payload;
    },
    addTopRatedMovies: (state, action: PayloadAction<TMDBMedia[]>) => {
      state.topRatedMovies = action.payload;
    },
    addUpcomingMovies: (state, action: PayloadAction<TMDBMedia[]>) => {
      state.upcomingMovies = action.payload;
    },
    addMovieDetails: (state, action: PayloadAction<MovieDetail>) => {
      state.movieDetails = action.payload;
    },
    addTrailerVideo: (state, action: PayloadAction<TrailerVideo | null>) => {
      state.trailerVideo = action.payload;
    },
  },
});

export const {
  addNowPlayingMovies,
  addPopularMovies,
  addTopRatedMovies,
  addUpcomingMovies,
  addMovieDetails,
  addTrailerVideo,
} = moviesSlice.actions;

export default moviesSlice.reducer;