import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: SessionState = {
  isAuthenticated: false,
  isLoading: true,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthenticated, setLoading, logout } = sessionSlice.actions;
export default sessionSlice.reducer;
