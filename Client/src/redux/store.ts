import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage/session"; // Use sessionStorage instead of localStorage for security
import sessionReducer from "./slices/sessionSlice";
import userReducer from "./slices/userSlice";
import refreshTokenReducer from "./slices/refreshTokenSlice";
import accessTokenReducer from "./slices/accessTokenSlice";
import passwordReducer from "./slices/passwordSlice";

// Root reducer that combines all slices
const rootReducer = combineReducers({
  session: sessionReducer,
  user: userReducer,
  refreshToken: refreshTokenReducer,
  accessToken: accessTokenReducer,
  passwords: passwordReducer,
});

// Configuration for Redux Persist
const persistConfig = {
  key: "root",
  storage,
  // Only persist non-sensitive data
  whitelist: ["session", "refreshToken", "user"],
  // Blacklist sensitive data (passwords will be encrypted before stored)
  blacklist: ["accessToken"], // Don't persist access token as a security measure
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Create the persistor
export const persistor = persistStore(store);

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
