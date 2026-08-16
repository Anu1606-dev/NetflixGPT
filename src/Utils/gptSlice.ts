import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConversationTurn, TMDBMedia, MovieDetail } from "./types";

interface GptState {
  showGptSearch: boolean;
  conversation: ConversationTurn[];
}

const initialState: GptState = {
  showGptSearch: false,
  conversation: [],
};

interface AddUserMessagePayload {
  text?: string;
  image?: string | null;
}

interface AddAssistantMessagePayload {
  text: string;
  movies?: TMDBMedia[];
  movieDetail?: MovieDetail | null;
}

const gptSlice = createSlice({
  name: "gpt",
  initialState,
  reducers: {
    toggleGptSearchView: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    addUserMessage: (state, action: PayloadAction<string | AddUserMessagePayload>) => {
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
    addAssistantMessage: (state, action: PayloadAction<AddAssistantMessagePayload>) => {
      state.conversation.push({
        role: "assistant",
        text: action.payload.text,
        movies: action.payload.movies || [],
        movieDetail: action.payload.movieDetail || null,
      });
    },
    // NEW: hydrates conversation from Firestore on load, without an extra network round trip per turn
    loadConversation: (state, action: PayloadAction<ConversationTurn[]>) => {
      state.conversation = action.payload;
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
  loadConversation,
  resetConversation,
} = gptSlice.actions;

export default gptSlice.reducer;