import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RefreshTokenState {
  token: string | null;
  expiresAt: number | null; // Unix timestamp in milliseconds
}

const initialState: RefreshTokenState = {
  token: null,
  expiresAt: null,
};

const refreshTokenSlice = createSlice({
  name: "refreshToken",
  initialState,
  reducers: {
    setRefreshToken: (
      state,
      action: PayloadAction<{ token: string; expiresAt: number | null }>
    ) => {
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt;
    },
    clearRefreshToken: (state) => {
      state.token = null;
      state.expiresAt = null;
    },
  },
});

export const { setRefreshToken, clearRefreshToken } = refreshTokenSlice.actions;

export default refreshTokenSlice.reducer;
