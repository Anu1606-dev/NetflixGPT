import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import moviesReducer from "./moviesSlice";
import trendingReducer from "./trendingSlice";
import tvReducer from "./tvSlice";
import gptReducer from "./gptSlice";
import discoverReducer from "./discoverSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    movies: moviesReducer,
    trending: trendingReducer,
    tv: tvReducer,
    gpt: gptReducer,
    discover: discoverReducer,
  },
});

export default appStore;