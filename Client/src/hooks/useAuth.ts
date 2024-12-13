import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  loginUser,
  registerUser,
  logoutUser,
  checkAuthStatus,
} from "@/redux/thunks/authThunks";
import { AppDispatch } from "@/redux/store";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.token.token);
  const user = useSelector((state: RootState) => state.user.user);
  const { isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.session
  );

  const login = useCallback(
    (email: string, password: string) => {
      return dispatch(loginUser({ email, password }));
    },
    [dispatch]
  );

  const register = useCallback(
    (email: string, password: string) => {
      return dispatch(registerUser({ email, password }));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const checkAuth = useCallback(() => {
    return dispatch(checkAuthStatus());
  }, [dispatch]);

  return {
    isAuthenticated,
    loading,
    error,
    token,
    user,
    login,
    register,
    logout,
    checkAuth,
  };
};
