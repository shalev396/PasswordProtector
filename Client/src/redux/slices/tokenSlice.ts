import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TokenState {
  token: string | null;
  expiresAt: number | null; // Unix timestamp in milliseconds
}

const initialState: TokenState = {
  token: null,
  expiresAt: null,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (
      state,
      action: PayloadAction<{ token: string; expiresAt: number }>
    ) => {
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt;
    },
    clearToken: (state) => {
      state.token = null;
      state.expiresAt = null;
    },
  },
});

export const { setToken, clearToken } = tokenSlice.actions;

// For backward compatibility
export const setAccessToken = setToken;
export const clearAccessToken = clearToken;

export default tokenSlice.reducer;
