import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import masterPasswordReducer from './masterPasswordSlice';
import { clearMasterPassword } from './masterPasswordSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    masterPassword: masterPasswordReducer,
  },
});

// ---------------------------------------------------------------------------
// Master-password TTL enforcement
// ---------------------------------------------------------------------------
// Clears the master password from Redux state when it expires, regardless of
// which route/component is mounted. This ensures sensitive material doesn't
// linger in memory beyond the intended TTL.
let masterPasswordTimer: ReturnType<typeof setTimeout> | null = null;
let scheduledExpiresAt: number | null = null;

store.subscribe(() => {
  const { expiresAt, value } = store.getState().masterPassword;

  if (value !== null && expiresAt !== null) {
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) {
      store.dispatch(clearMasterPassword());
    } else if (expiresAt !== scheduledExpiresAt) {
      if (masterPasswordTimer !== null) {
        clearTimeout(masterPasswordTimer);
      }
      scheduledExpiresAt = expiresAt;
      masterPasswordTimer = setTimeout(() => {
        masterPasswordTimer = null;
        scheduledExpiresAt = null;
        store.dispatch(clearMasterPassword());
      }, remaining);
    }
  } else {
    if (masterPasswordTimer !== null) {
      clearTimeout(masterPasswordTimer);
      masterPasswordTimer = null;
    }
    scheduledExpiresAt = null;
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
