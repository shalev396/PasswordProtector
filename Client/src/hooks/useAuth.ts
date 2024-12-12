import { useState } from "react";
import { useDispatch } from "react-redux";
import * as authService from "@/services/authService";
import { setUser, clearUser } from "@/redux/slices/userSlice";
import { setToken, clearToken } from "@/redux/slices/tokenSlice";
import {
  setAuthenticated,
  setLoading,
  logout,
} from "@/redux/slices/sessionSlice";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const login = async (email: string, password: string) => {
    setError(null);
    dispatch(setLoading(true));

    try {
      const response = await authService.login(email, password);

      // Update Redux state
      dispatch(setToken(response.token));
      dispatch(
        setUser({
          id: response.user.id,
          name: email.split("@")[0], // Use email username as fallback
          email: response.user.email,
        })
      );
      dispatch(setAuthenticated(true));

      return response;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An error occurred during login";
      setError(errorMsg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (email: string, password: string) => {
    setError(null);
    dispatch(setLoading(true));

    try {
      const response = await authService.register(email, password);

      // Update Redux state
      dispatch(setToken(response.token));
      dispatch(
        setUser({
          id: response.user.id,
          name: email.split("@")[0], // Default name from email
          email: response.user.email,
        })
      );
      dispatch(setAuthenticated(true));

      return response;
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "An error occurred during registration";
      setError(errorMsg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logoutUser = () => {
    authService.logout();

    // Clear Redux state
    dispatch(clearToken());
    dispatch(clearUser());
    dispatch(logout());
  };

  return {
    login,
    register,
    logout: logoutUser,
    error,
  };
}
