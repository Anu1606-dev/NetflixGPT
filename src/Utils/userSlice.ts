import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

const userSlice = createSlice({
  name: "user",
  initialState: null as UserState | null,
  reducers: {
    addUser: (_state, action: PayloadAction<UserState>) => action.payload,
    removeUser: () => null,
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;