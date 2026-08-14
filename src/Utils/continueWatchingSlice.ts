import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContinueWatchingItem } from "./types";

interface ContinueWatchingState {
  items: ContinueWatchingItem[];
}

const initialState: ContinueWatchingState = {
  items: [],
};

const continueWatchingSlice = createSlice({
  name: "continueWatching",
  initialState,
  reducers: {
    setContinueWatching: (state, action: PayloadAction<ContinueWatchingItem[]>) => {
      state.items = action.payload;
    },
    clearContinueWatching: (state) => {
      state.items = [];
    },
  },
});

export const { setContinueWatching, clearContinueWatching } = continueWatchingSlice.actions;
export default continueWatchingSlice.reducer;