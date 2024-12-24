import { createSlice } from "@reduxjs/toolkit";

export interface SessionState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

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
      state.error = null;
    },
    setUnauthenticated: (state) => {
      state.isAuthenticated = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
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
