import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import masterPasswordReducer from './masterPasswordSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    masterPassword: masterPasswordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
