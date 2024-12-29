import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local storage
import { combineReducers } from "@reduxjs/toolkit";

// Import reducers
import userReducer from "./slices/userSlice";
import sessionReducer from "./slices/sessionSlice";
import passwordReducer from "./slices/passwordSlice";
import accessTokenReducer from "./slices/accessTokenSlice";
import refreshTokenReducer from "./slices/refreshTokenSlice";

// Configure persist options
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "session", "accessToken", "refreshToken"], // Only these will be persisted
  // Add migration for version changes if needed
  version: 1,
};

// Create a function to validate persisted state before hydration
const validatePersistedState = (state: any) => {
  // Validate access token expiration
  if (
    state?.accessToken?.expiresAt &&
    state.accessToken.expiresAt < Date.now()
  ) {
    console.warn(
      "Expired access token found in storage, clearing authentication state"
    );
    // Clear authentication state
    state.accessToken = undefined;
    state.session = { ...state.session, isAuthenticated: false };
  }

  // Ensure session state is consistent with token state
  if (state?.session?.isAuthenticated && !state?.accessToken?.token) {
    console.warn(
      "Inconsistent auth state: authenticated but no token - resetting"
    );
    state.session = { ...state.session, isAuthenticated: false };
  }

  return state;
};

// Create rootReducer
const rootReducer = combineReducers({
  user: userReducer,
  session: sessionReducer,
  passwords: passwordReducer,
  accessToken: accessTokenReducer,
  refreshToken: refreshTokenReducer,
});

// Create persisted reducer with transform
const persistedReducer = persistReducer(
  {
    ...persistConfig,
    // Use stateReconciler to validate state before hydration
    stateReconciler: (inboundState, originalState) => {
      return validatePersistedState(inboundState);
    },
  },
  rootReducer
);

// Create the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializableCheck
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
