import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gpt",
  initialState: {
    showGptSearch: false,
    conversation: [], // [{ role: 'user'|'assistant', text, movies? }]
  },
  reducers: {
    toggleGptSearchView: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    addUserMessage: (state, action) => {
      state.conversation.push({ role: "user", text: action.payload });
    },
    addAssistantMessage: (state, action) => {
      state.conversation.push({
        role: "assistant",
        text: action.payload.text,
        movies: action.payload.movies || [],
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