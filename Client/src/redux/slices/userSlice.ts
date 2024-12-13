import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  name: string;
  email: string;
  masterKey?: string; // Used for encryption/decryption of passwords
}

export interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    // Add ability to set master key separately
    setMasterKey: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.masterKey = action.payload;
      }
    },
  },
});

export const { setUser, clearUser, setMasterKey } = userSlice.actions;

export default userSlice.reducer;
