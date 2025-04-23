import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AccessTokenState {
  token: string | null;
  expiresAt: number | null; // Unix timestamp when the token expires
}

const initialState: AccessTokenState = {
  token: null,
  expiresAt: null,
};

export const accessTokenSlice = createSlice({
  name: "accessToken",
  initialState,
  reducers: {
    setAccessToken: (
      state,
      action: PayloadAction<{ token: string; expiresAt: number | null }>
    ) => {
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt;
    },
    clearAccessToken: (state) => {
      state.token = null;
      state.expiresAt = null;
    },
  },
});

export const { setAccessToken, clearAccessToken } = accessTokenSlice.actions;

export default accessTokenSlice.reducer;
