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
import storage from "redux-persist/lib/storage/session";

import sessionReducer from "./slices/sessionSlice";
import tokenReducer from "./slices/tokenSlice";
import userReducer from "./slices/userSlice";
import passwordReducer from "./slices/passwordSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["session", "token", "user", "passwords"],
};

const rootReducer = combineReducers({
  session: sessionReducer,
  token: tokenReducer,
  user: userReducer,
  passwords: passwordReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
