import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    genres: { movie: null, tv: null }, // cached once, reused every search
  },
  reducers: {
    setGenres: (state, action) => {
      state.genres = action.payload;
    },
  },
});

export const { setGenres } = searchSlice.actions;
export default searchSlice.reducer;