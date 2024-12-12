import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface PasswordState {
  items: Password[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PasswordState = {
  items: [],
  isLoading: false,
  error: null,
};

const passwordSlice = createSlice({
  name: "passwords",
  initialState,
  reducers: {
    setPasswords: (state, action: PayloadAction<Password[]>) => {
      state.items = action.payload;
    },
    addPassword: (state, action: PayloadAction<Password>) => {
      state.items.push(action.payload);
    },
    updatePassword: (state, action: PayloadAction<Password>) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deletePassword: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPasswords,
  addPassword,
  updatePassword,
  deletePassword,
  setLoading,
  setError,
} = passwordSlice.actions;

export default passwordSlice.reducer;
