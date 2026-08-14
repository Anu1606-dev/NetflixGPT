import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MyListItem } from "./types";

interface MyListState {
  items: MyListItem[];
}

const initialState: MyListState = {
  items: [],
};

const myListSlice = createSlice({
  name: "myList",
  initialState,
  reducers: {
    setMyList: (state, action: PayloadAction<MyListItem[]>) => {
      state.items = action.payload;
    },
    clearMyList: (state) => {
      state.items = [];
    },
  },
});

export const { setMyList, clearMyList } = myListSlice.actions;
export default myListSlice.reducer;