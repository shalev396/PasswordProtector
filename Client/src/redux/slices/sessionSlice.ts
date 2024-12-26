import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SessionState } from "../../types";

const initialState: SessionState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setAuthenticated: (state) => {
      state.isAuthenticated = true;
    },
    setUnauthenticated: (state) => {
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearSession: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setAuthenticated,
  setUnauthenticated,
  setLoading,
  setError,
  clearSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;
