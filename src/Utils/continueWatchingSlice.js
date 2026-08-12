import { createSlice } from "@reduxjs/toolkit";

const continueWatchingSlice = createSlice({
  name: "continueWatching",
  initialState: {
    items: [],
  },
  reducers: {
    setContinueWatching: (state, action) => {
      state.items = action.payload;
    },
    clearContinueWatching: (state) => {
      state.items = [];
    },
  },
});

export const { setContinueWatching, clearContinueWatching } = continueWatchingSlice.actions;
export default continueWatchingSlice.reducer;