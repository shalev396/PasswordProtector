import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { store } from "../redux/store";
import { clearSession } from "../redux/slices/sessionSlice";
import { clearUser } from "../redux/slices/userSlice";
import { clearRefreshToken } from "../redux/slices/refreshTokenSlice";
import authService from "../services/authService";
import { setRefreshToken } from "../redux/slices/refreshTokenSlice";
import {
  setAccessToken,
  clearAccessToken,
} from "../redux/slices/accessTokenSlice";

const API_URL = "http://localhost:5000/api";

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const isAuthenticated = state.session?.isAuthenticated;
    const accessToken = state.accessToken?.token;

    if (isAuthenticated && accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh and error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const state = store.getState();
        const refreshToken = state.refreshToken?.token;

        if (!refreshToken) {
          // No refresh token, user needs to login again
          handleLogout();
          return Promise.reject(error);
        }

        // Attempt to refresh the token
        const response = await authService.refreshToken(refreshToken);

        // Update tokens in Redux store
        if (response.refreshToken) {
          store.dispatch(
            setRefreshToken({
              token: response.refreshToken,
              expiresAt: response.refreshTokenExpiresAt || null,
            })
          );
        }

        if (response.accessToken) {
          store.dispatch(
            setAccessToken({
              token: response.accessToken,
              expiresAt: response.accessTokenExpiresAt || Date.now() + 3600000, // Default 1 hour if not provided
            })
          );
        }

        // Update the Authorization header with new token
        originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;

        // Retry the original request with new token
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Token refresh failed, logout user
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to handle logout
const handleLogout = () => {
  store.dispatch(clearSession());
  store.dispatch(clearUser());
  store.dispatch(clearRefreshToken());
  store.dispatch(clearAccessToken());
};

export default apiClient;
