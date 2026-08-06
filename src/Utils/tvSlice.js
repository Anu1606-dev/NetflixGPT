import { createSlice } from "@reduxjs/toolkit";

const tvSlice = createSlice({
  name: "tv",
  initialState: {
    airingToday: null,
    onTheAir: null,
    popularTV: null,
    topRatedTV: null,
    tvDetails: null,
  },
  reducers: {
    addAiringToday: (state, action) => {
      state.airingToday = action.payload;
    },
    addOnTheAir: (state, action) => {
      state.onTheAir = action.payload;
    },
    addPopularTV: (state, action) => {
      state.popularTV = action.payload;
    },
    addTopRatedTV: (state, action) => {
      state.topRatedTV = action.payload;
    },
    addTVDetails: (state, action) => {
      state.tvDetails = action.payload;
    },
  },
});

export const {
  addAiringToday,
  addOnTheAir,
  addPopularTV,
  addTopRatedTV,
  addTVDetails,
} = tvSlice.actions;

export default tvSlice.reducer;