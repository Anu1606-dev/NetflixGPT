import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import moviesReducer from "./moviesSlice";
import trendingReducer from "./trendingSlice";
import tvReducer from "./tvSlice";
import gptReducer from "./gptSlice";
import discoverReducer from "./discoverSlice";
import searchReducer from "./searchSlice";
import myListReducer from "./myListSlice";
import continueWatchingReducer from "./continueWatchingSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    movies: moviesReducer,
    trending: trendingReducer,
    tv: tvReducer,
    gpt: gptReducer,
    discover: discoverReducer,
    search: searchReducer,
    myList: myListReducer,
    continueWatching: continueWatchingReducer,
  },
});

// These two types are the payoff of this whole migration — every component
// using the typed hooks below now gets autocomplete and type-checking on
// the entire Redux store shape.
export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;

export default appStore;