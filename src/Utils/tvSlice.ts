import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TMDBMedia } from "./types";

interface TVState {
  airingToday: TMDBMedia[] | null;
  onTheAir: TMDBMedia[] | null;
  popularTV: TMDBMedia[] | null;
  topRatedTV: TMDBMedia[] | null;
  tvDetails: any | null;
}

const initialState: TVState = {
  airingToday: null,
  onTheAir: null,
  popularTV: null,
  topRatedTV: null,
  tvDetails: null,
};

const tvSlice = createSlice({
  name: "tv",
  initialState,
  reducers: {
    addAiringToday: (state, action: PayloadAction<TMDBMedia[]>) => {
      state.airingToday = action.payload;
    },
    addOnTheAir: (state, action: PayloadAction<TMDBMedia[]>) => {
      state.onTheAir = action.payload;
    },
    addPopularTV: (state, action: PayloadAction<TMDBMedia[]>) => {
      state.popularTV = action.payload;
    },
    addTopRatedTV: (state, action: PayloadAction<TMDBMedia[]>) => {
      state.topRatedTV = action.payload;
    },
    addTVDetails: (state, action: PayloadAction<any>) => {
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