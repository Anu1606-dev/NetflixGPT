import { createSlice } from "@reduxjs/toolkit";

const myListSlice = createSlice({
  name: "myList",
  initialState: {
    items: [],
  },
  reducers: {
    setMyList: (state, action) => {
      state.items = action.payload;
    },
    clearMyList: (state) => {
      state.items = [];
    },
  },
});

export const { setMyList, clearMyList } = myListSlice.actions;
export default myListSlice.reducer;