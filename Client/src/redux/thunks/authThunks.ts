import { createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "@/services/api.service";
import { setToken, clearToken } from "@/redux/slices/tokenSlice";
import { setUser, clearUser } from "@/redux/slices/userSlice";
import {
  setAuthenticated,
  setUnauthenticated,
} from "@/redux/slices/sessionSlice";
import { hashPassword } from "@/lib/crypto";

// Login thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { dispatch }
  ) => {
    try {
      // Hash the password before sending to server
      const hashedPassword = await hashPassword(password, email);

      // Send login request
      const response = await authAPI.login(email, hashedPassword);

      // Save token and user data in store
      dispatch(setToken(response.token));
      dispatch(
        setUser({
          ...response.user,
          masterKey: password, // Store raw password as master key for encryption
        })
      );
      dispatch(setAuthenticated());

      return response;
    } catch (error) {
      // Handle login error
      dispatch(setUnauthenticated());
      throw error;
    }
  }
);

// Register thunk
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    { email, password }: { email: string; password: string },
    { dispatch }
  ) => {
    try {
      // Hash the password before sending to server
      const hashedPassword = await hashPassword(password, email);

      // Send register request
      const response = await authAPI.register(email, hashedPassword);

      // Save token and user data in store
      dispatch(setToken(response.token));
      dispatch(
        setUser({
          ...response.user,
          masterKey: password, // Store raw password as master key for encryption
        })
      );
      dispatch(setAuthenticated());

      return response;
    } catch (error) {
      // Handle registration error
      dispatch(setUnauthenticated());
      throw error;
    }
  }
);

// Logout thunk
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      // Clear auth data from store
      dispatch(clearToken());
      dispatch(clearUser());
      dispatch(setUnauthenticated());
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
);

// Check auth status thunk
export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, { dispatch, getState }) => {
    try {
      const state = getState() as { token: { token: string | null } };

      if (!state.token.token) {
        dispatch(setUnauthenticated());
        return null;
      }

      // Get user profile from server
      const userProfile = await authAPI.getProfile();
      dispatch(setAuthenticated());
      dispatch(setUser(userProfile));

      return userProfile;
    } catch (error) {
      dispatch(clearToken());
      dispatch(clearUser());
      dispatch(setUnauthenticated());
      console.error("Auth check error:", error);
      return null;
    }
  }
);
