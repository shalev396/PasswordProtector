import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setLoading,
  setAuthenticated,
  setError,
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
import authService from "@/services/authService";
import { AuthResponse } from "@/types";

/**
 * Custom hook for authentication functionality
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const refreshToken = useSelector(
    (state: RootState) => state.refreshToken.token
  );
  const user = useSelector((state: RootState) => state.user.user);
  const { isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.session
  );

  /**
   * Login with email and password
   */
  const login = useCallback(
    async (email: string, password: string): Promise<AuthResponse> => {
      try {
        dispatch(setLoading(true));
        const response = await authService.login({ email, password });

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

        dispatch(setUser(response.user));
        dispatch(setAuthenticated());
        dispatch(setLoading(false));
        dispatch(setError(null));

        return response;
      } catch (error: any) {
        dispatch(setLoading(false));
        dispatch(setError(error.message || "Login failed"));
        throw error;
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
        dispatch(setLoading(true));
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

        dispatch(setUser(response.user));
        dispatch(setAuthenticated());
        dispatch(setLoading(false));
        dispatch(setError(null));

        return response;
      } catch (error: any) {
        dispatch(setLoading(false));
        dispatch(setError(error.message || "Registration failed"));
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Logout the current user
   */
  const logout = useCallback(() => {
    // Call API to logout
    authService.logout().finally(() => {
      // Clear all auth-related state
      dispatch(clearSession());
      dispatch(clearUser());
      dispatch(clearRefreshToken());
      dispatch(clearAccessToken());
    });
  }, [dispatch]);

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

  return {
    // State
    isAuthenticated,
    isLoading,
    error,
    token: refreshToken,
    user,

    // Actions
    login,
    register,
    logout,
    getProfile,
    refreshToken: refreshTokenManually,
    getMasterPassword,
  };
};

export default useAuth;
