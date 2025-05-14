import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSessionAuthenticated,
  setSessionLoading,
  setSessionError,
  clearSession,
} from "@/redux/slices/sessionSlice";
import { setUser, clearUser } from "@/redux/slices/userSlice";
import {
  setRefreshToken,
  clearRefreshToken,
} from "@/redux/slices/refreshTokenSlice";
import {
  setAccessToken,
  clearAccessToken,
} from "@/redux/slices/accessTokenSlice";
import { hashPassword } from "@/lib/crypto";
import authService from "@/services/authService";
import { AuthResponse } from "@/types";
import { useNavigate } from "react-router-dom";

import { clearQueryCache } from "@/lib/queryClient";

/**
 * Custom hook for authentication functionality
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get authentication state from Redux
  const user = useSelector((state: RootState) => state.user.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.session.isAuthenticated
  );
  const isLoading = useSelector((state: RootState) => state.session.isLoading);
  const error = useSelector((state: RootState) => state.session.error);
  const accessToken = useSelector(
    (state: RootState) => state.accessToken?.token
  );
  const accessTokenExpiresAt = useSelector(
    (state: RootState) => state.accessToken?.expiresAt
  );
  const refreshToken = useSelector(
    (state: RootState) => state.refreshToken?.token
  );

  /**
   * Log the user out
   */
  const logout = useCallback(() => {
    // Call auth service to log out
    try {
      if (accessToken) {
        authService.logout().catch((err) => {
          console.warn("Error during logout:", err);
        });
      }
    } catch (error) {
      console.error("Failed to call logout endpoint:", error);
    } finally {
      // Clear Redux state regardless of API response
      dispatch(clearUser());
      dispatch(clearAccessToken());
      dispatch(clearRefreshToken());
      dispatch(clearSession());

      // Clear API headers
      authService.setAuthHeader(null);

      // Clear React Query cache
      clearQueryCache();

      // Redirect to login page
      navigate("/login");
    }
  }, [dispatch, navigate, accessToken]);

  // Check if token has expired
  const isTokenExpired = useCallback(() => {
    if (!accessTokenExpiresAt) {
      console.warn("No token expiration timestamp available");
      return true;
    }

    // Add a 10-second buffer to account for timing differences
    const isExpired = Date.now() > accessTokenExpiresAt - 10000;

    if (isExpired) {
      console.warn(
        `Token expired at ${new Date(
          accessTokenExpiresAt
        ).toISOString()}, current time is ${new Date().toISOString()}`
      );
    }

    return isExpired;
  }, [accessTokenExpiresAt]);

  // Check token validity - both presence and expiration
  const isTokenValid = useCallback(() => {
    const valid = !!accessToken && !isTokenExpired();

    return valid;
  }, [accessToken, isTokenExpired]);

  // Force set the auth header with the current token
  const ensureAuthHeader = useCallback(() => {
    if (accessToken) {
      authService.setAuthHeader(accessToken);
      return true;
    } else {
      console.warn("Cannot set auth header - no token available");
      return false;
    }
  }, [accessToken]);

  // Login with email and password
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        dispatch(setSessionLoading(true));
        dispatch(setSessionError(null));

        // Get auth response from API
        const response = await authService.login({ email, password });

        // Validate response
        if (!response || !response.accessToken) {
          throw new Error("Invalid authentication response");
        }

        // Set auth data in Redux
        const { user, accessToken, refreshToken, accessTokenExpiresAt } =
          response;

        // Set master key using email and password
        const masterKey = await hashPassword(password, email);

        // Update user with master key
        const updatedUser = { ...user, masterKey };

        // Set auth header
        authService.setAuthHeader(accessToken);

        // Update Redux state
        dispatch(setUser(updatedUser));
        dispatch(
          setAccessToken({
            token: accessToken,
            expiresAt: accessTokenExpiresAt || Date.now() + 3600000,
          })
        );
        if (refreshToken) {
          dispatch(
            setRefreshToken({
              token: refreshToken,
              expiresAt: response.refreshTokenExpiresAt || null,
            })
          );
        }
        dispatch(setSessionAuthenticated(true));

        return true;
      } catch (err: any) {
        console.error("Login error:", err);
        const errorMessage =
          err.response?.data?.message || err.message || "Login failed";
        dispatch(setSessionError(errorMessage));
        dispatch(setSessionAuthenticated(false));
        // Clear any existing tokens to prevent redirect loops
        dispatch(clearAccessToken());
        dispatch(clearRefreshToken());
        return false;
      } finally {
        dispatch(setSessionLoading(false));
      }
    },
    [dispatch]
  );

  /**
   * Register a new user
   */
  const register = useCallback(
    async (
      email: string,
      password: string,
      name?: string
    ): Promise<AuthResponse> => {
      try {
        dispatch(setSessionLoading(true));
        const response = await authService.register({
          name: name || email.split("@")[0],
          email,
          password,
        });

        // Store tokens and user data in Redux
        if (response.accessToken) {
          dispatch(
            setAccessToken({
              token: response.accessToken,
              expiresAt: response.accessTokenExpiresAt || Date.now() + 3600000, // Default 1 hour
            })
          );
        }

        if (response.refreshToken) {
          dispatch(
            setRefreshToken({
              token: response.refreshToken,
              expiresAt:
                response.refreshTokenExpiresAt || Date.now() + 86400000, // Default 24 hours
            })
          );
        }

        // Generate master key using the same approach as login
        const masterKey = await hashPassword(password, email);

        // Set the user data in Redux with master key
        const userWithMasterKey = {
          ...response.user,
          masterKey: masterKey, // Use the hashed key instead of raw password
        };

        dispatch(setUser(userWithMasterKey));
        dispatch(setSessionAuthenticated(true));
        dispatch(setSessionLoading(false));
        dispatch(setSessionError(null));

        return response;
      } catch (error: any) {
        dispatch(setSessionLoading(false));
        dispatch(setSessionError(error.message || "Registration failed"));
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Get user profile
   */
  const getProfile = useCallback(async () => {
    return authService.getUserProfile();
  }, []);

  /**
   * Manually refresh the token (though it's usually handled automatically by interceptors)
   */
  const refreshTokenManually = useCallback(async () => {
    if (!refreshToken) return null;

    try {
      const response = await authService.refreshToken(refreshToken);

      // Update tokens in store
      if (response.accessToken) {
        dispatch(
          setAccessToken({
            token: response.accessToken,
            expiresAt: response.accessTokenExpiresAt || Date.now() + 3600000,
          })
        );
      }

      if (response.refreshToken) {
        dispatch(
          setRefreshToken({
            token: response.refreshToken,
            expiresAt: response.refreshTokenExpiresAt || Date.now() + 86400000,
          })
        );
      }

      return response;
    } catch (error) {
      // If refresh fails, clear auth state
      logout();
      return null;
    }
  }, [refreshToken, dispatch, logout]);

  /**
   * Get the master password for encryption
   */
  const getMasterPassword = useCallback(() => {
    return user?.masterKey || null;
  }, [user]);

  // On component mount, validate token status
  useEffect(() => {
    // If not loading and has token but token is expired
    if (!isLoading && accessToken && isTokenExpired()) {
      console.warn("Access token has expired, logging out", {
        expiresAt: accessTokenExpiresAt
          ? new Date(accessTokenExpiresAt).toISOString()
          : "unknown",
        currentTime: new Date().toISOString(),
        accessTokenLength: accessToken.length,
      });
      // Token is expired but still in Redux - force logout to prevent redirect loops
      logout();
    } else if (accessToken && !isTokenExpired()) {
      // Valid token, ensure header is set

      ensureAuthHeader();
    }
  }, [
    isLoading,
    accessToken,
    isTokenExpired,
    logout,
    accessTokenExpiresAt,
    ensureAuthHeader,
  ]);

  return {
    // State
    user,
    isAuthenticated: isAuthenticated && isTokenValid(),
    isLoading,
    error,
    accessToken,
    refreshToken,

    // Actions
    login,
    register,
    logout,
    getProfile,
    refreshTokenManually,
    getMasterPassword,
    isTokenValid,
    ensureAuthHeader,
  };
};

export default useAuth;
