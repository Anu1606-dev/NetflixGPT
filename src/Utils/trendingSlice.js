import { createSlice } from "@reduxjs/toolkit";

const trendingSlice = createSlice({
  name: "trending",
  initialState: {
    trendingAll: null,
    trendingMovies: null,
    trendingPeople: null,
    trendingTV: null,
  },
  reducers: {
    addTrendingAll: (state, action) => {
      state.trendingAll = action.payload;
    },
    addTrendingMovies: (state, action) => {
      state.trendingMovies = action.payload;
    },
    addTrendingPeople: (state, action) => {
      state.trendingPeople = action.payload;
    },
    addTrendingTV: (state, action) => {
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