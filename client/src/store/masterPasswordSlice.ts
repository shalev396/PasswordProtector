import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

/** Master password lives in memory for this many milliseconds. */
const MASTER_PASSWORD_TTL_MS = 15 * 60 * 1000; // 15 minutes

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
interface MasterPasswordState {
  value: string | null;
  expiresAt: number | null;
}

const initialState: MasterPasswordState = {
  value: null,
  expiresAt: null,
};

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const masterPasswordSlice = createSlice({
  name: 'masterPassword',
  initialState,
  reducers: {
    /** Sets the master password in Redux memory with a fresh TTL. */
    setMasterPassword: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
      state.expiresAt = Date.now() + MASTER_PASSWORD_TTL_MS;
    },

    /** Clears the master password from memory (e.g. on expiry or logout). */
    clearMasterPassword: (state) => {
      state.value = null;
      state.expiresAt = null;
    },
  },
  extraReducers: (builder) => {
    // Clear master password when the user logs out
    builder.addMatcher(
      (action: { type: string }) => action.type === 'user/logout',
      (state) => {
        state.value = null;
        state.expiresAt = null;
      },
    );
  },
});

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
export const { setMasterPassword, clearMasterPassword } = masterPasswordSlice.actions;

export const selectMasterPassword = (state: RootState): string | null => {
  const { value, expiresAt } = state.masterPassword;
  if (value === null || expiresAt === null) {
    return null;
  }
  return Date.now() > expiresAt ? null : value;
};
export const selectMasterPasswordExpiresAt = (state: RootState): number | null =>
  state.masterPassword.expiresAt;
export const selectHasMasterPassword = (state: RootState): boolean => {
  const { value, expiresAt } = state.masterPassword;
  if (value === null || expiresAt === null) {
    return false;
  }
  return Date.now() <= expiresAt;
};

export default masterPasswordSlice.reducer;
