import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TMDBMedia } from "./types";

interface DiscoverState {
  languageMovies: Record<string, TMDBMedia[]>;
}

const initialState: DiscoverState = {
  languageMovies: {},
};

const discoverSlice = createSlice({
  name: "discover",
  initialState,
  reducers: {
    addLanguageMovies: (
      state,
      action: PayloadAction<{ langCode: string; movies: TMDBMedia[] }>
    ) => {
      const { langCode, movies } = action.payload;
      state.languageMovies[langCode] = movies;
    },
  },
});

export const { addLanguageMovies } = discoverSlice.actions;
export default discoverSlice.reducer;