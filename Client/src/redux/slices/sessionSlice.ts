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
    setAuthenticated: (state, action: PayloadAction<boolean | undefined>) => {
      state.isAuthenticated =
        action.payload !== undefined ? action.payload : true;
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

export const { setAuthenticated, setLoading, setError, clearSession } =
  sessionSlice.actions;

// Aliases for backward compatibility
export const setSessionAuthenticated = setAuthenticated;
export const setSessionLoading = setLoading;
export const setSessionError = setError;

export default sessionSlice.reducer;
