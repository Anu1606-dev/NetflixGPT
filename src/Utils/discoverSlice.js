import { createSlice } from "@reduxjs/toolkit";

const discoverSlice = createSlice({
  name: "discover",
  initialState: {
    languageMovies: {}, // e.g. { en: [...], hi: [...] }
  },
  reducers: {
    addLanguageMovies: (state, action) => {
      const { langCode, movies } = action.payload;
      state.languageMovies[langCode] = movies;
    },
  },
});

export const { addLanguageMovies } = discoverSlice.actions;
export default discoverSlice.reducer;