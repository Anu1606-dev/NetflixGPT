import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Genre } from "./types";

interface SearchState {
  genres: {
    movie: Genre[] | null;
    tv: Genre[] | null;
  };
}

const initialState: SearchState = {
  genres: { movie: null, tv: null },
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setGenres: (
      state,
      action: PayloadAction<{ movie: Genre[]; tv: Genre[] }>
    ) => {
      state.genres = action.payload;
    },
  },
});

export const { setGenres } = searchSlice.actions;
export default searchSlice.reducer;