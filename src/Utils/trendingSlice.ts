import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TMDBMedia } from "./types";

interface TrendingState {
  trendingAll: TMDBMedia[] | null;
  trendingMovies: TMDBMedia[] | null;
  trendingPeople: TMDBMedia[] | null;
  trendingTV: TMDBMedia[] | null;
}

const initialState: TrendingState = {
  trendingAll: null,
  trendingMovies: null,
  trendingPeople: null,
  trendingTV: null,
};

const trendingSlice = createSlice({
  name: "trending",
  initialState,
  reducers: {
    addTrendingAll: (state, action: PayloadAction<TMDBMedia[]>) => {
      state.trendingAll = action.payload;
    },
    addTrendingMovies: (state, action: PayloadAction<TMDBMedia[]>) => {
      state.trendingMovies = action.payload;
    },
    addTrendingPeople: (state, action: PayloadAction<TMDBMedia[]>) => {
      state.trendingPeople = action.payload;
    },
    addTrendingTV: (state, action: PayloadAction<TMDBMedia[]>) => {
      state.trendingTV = action.payload;
    },
  },
});

export const {
  addTrendingAll,
  addTrendingMovies,
  addTrendingPeople,
  addTrendingTV,
} = trendingSlice.actions;

export default trendingSlice.reducer;