import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gpt",
  initialState: {
    showGptSearch: false,   // is the GPT search screen open or not
    gptMovieNames: null,    // ["Movie A", "Movie B", ...]
    gptMovieResults: null,  // matching TMDB data for each name
  },
  reducers: {
    toggleGptSearchView: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    addGptMovieResult: (state, action) => {
      state.gptMovieNames = action.payload.movieNames;
      state.gptMovieResults = action.payload.movieResults;
    },
  },
});

export const { toggleGptSearchView, addGptMovieResult } = gptSlice.actions;
export default gptSlice.reducer;