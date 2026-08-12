import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gpt",
  initialState: {
    showGptSearch: false,
    conversation: [],
  },
  reducers: {
    toggleGptSearchView: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    addUserMessage: (state, action) => {
      const payload = action.payload;
      if (typeof payload === "string") {
        state.conversation.push({ role: "user", text: payload, image: null });
      } else {
        state.conversation.push({
          role: "user",
          text: payload.text || "",
          image: payload.image || null,
        });
      }
    },
    addAssistantMessage: (state, action) => {
      state.conversation.push({
        role: "assistant",
        text: action.payload.text,
        movies: action.payload.movies || [],
        movieDetail: action.payload.movieDetail || null,
      });
    },
    resetConversation: (state) => {
      state.conversation = [];
    },
  },
});

export const {
  toggleGptSearchView,
  addUserMessage,
  addAssistantMessage,
  resetConversation,
} = gptSlice.actions;

export default gptSlice.reducer;

