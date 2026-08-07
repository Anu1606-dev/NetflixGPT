import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import moviesReducer from "./moviesSlice";
import trendingReducer from "./trendingSlice";
import tvReducer from "./tvSlice";
import gptReducer from "./gptSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    movies: moviesReducer,
    trending: trendingReducer,
    tv: tvReducer,
    gpt: gptReducer,
  },
});

export default appStore;