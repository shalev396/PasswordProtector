import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
} from "../../types";
import authService from "../../services/authService";
import { setUser, clearUser } from "../slices/userSlice";
import {
  setAuthenticated,
  setLoading,
  setError,
  clearSession,
} from "../slices/sessionSlice";
import { setAccessToken, clearAccessToken } from "../slices/tokenSlice";
import {
  setRefreshToken,
  clearRefreshToken,
} from "../slices/refreshTokenSlice";
import { clearPasswords } from "../slices/passwordSlice";
import passwordService from "../../services/passwordService";

// Calculate token expiration time (in milliseconds since epoch)
const calculateExpirationTime = (expiresIn: number): number => {
  return Date.now() + expiresIn * 1000;
};

// Register a new user
export const register = createAsyncThunk(
  "auth/register",
  async (
    {
      credentials,
      masterKey,
    }: { credentials: RegisterCredentials; masterKey: string },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response: AuthResponse = await authService.register(credentials);

      // Set up auth headers for subsequent requests
      authService.setAuthHeader(response.accessToken);
      passwordService.setAuthHeader(response.accessToken);

      // Store tokens and user data in Redux
      dispatch(
        setAccessToken({
          token: response.accessToken,
          expiresAt: calculateExpirationTime(3600), // Assuming 1 hour expiry
        })
      );

      dispatch(
        setRefreshToken({
          token: response.refreshToken,
          expiresAt: calculateExpirationTime(604800), // Assuming 1 week expiry
        })
      );

      // Store master key with user data for encryption/decryption
      const userData: User = {
        ...response.user,
        masterKey,
      };

      dispatch(setUser(userData));
      dispatch(setAuthenticated());

      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async (
    {
      credentials,
      masterKey,
    }: { credentials: LoginCredentials; masterKey: string },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response: AuthResponse = await authService.login(credentials);

      // Set up auth headers for subsequent requests
      authService.setAuthHeader(response.accessToken);
      passwordService.setAuthHeader(response.accessToken);

      // Store tokens and user data in Redux
      dispatch(
        setAccessToken({
          token: response.accessToken,
          expiresAt: calculateExpirationTime(3600), // Assuming 1 hour expiry
        })
      );

      dispatch(
        setRefreshToken({
          token: response.refreshToken,
          expiresAt: calculateExpirationTime(604800), // Assuming 1 week expiry
        })
      );

      // Store master key with user data for encryption/decryption
      const userData: User = {
        ...response.user,
        masterKey,
      };

      dispatch(setUser(userData));
      dispatch(setAuthenticated());

      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Refresh auth token
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (token: string, { dispatch }) => {
    try {
      const response = await authService.refreshToken(token);

      // Update auth header with new token
      authService.setAuthHeader(response.accessToken);
      passwordService.setAuthHeader(response.accessToken);

      // Update tokens in Redux
      dispatch(
        setAccessToken({
          token: response.accessToken,
          expiresAt: calculateExpirationTime(3600), // Assuming 1 hour expiry
        })
      );

      dispatch(
        setRefreshToken({
          token: response.refreshToken,
          expiresAt: calculateExpirationTime(604800), // Assuming 1 week expiry
        })
      );

      return response;
    } catch (error) {
      // If refresh fails, log the user out
      dispatch(logout());
      throw error;
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear auth header
      authService.setAuthHeader(null);
      passwordService.setAuthHeader(null);

      // Clear all auth-related state
      dispatch(clearAccessToken());
      dispatch(clearRefreshToken());
      dispatch(clearUser());
      dispatch(clearSession());
      dispatch(clearPasswords());
    }
  }
);
