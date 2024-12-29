import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
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

// Extend the InternalAxiosRequestConfig type to include our custom properties
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime?: number;
      [key: string]: any;
    };
    _retry?: boolean;
  }
}

// Make sure we're using the correct API URL
const API_URL = "http://localhost:5000/api";
console.log("Initializing API client with URL:", API_URL);

// Check server connectivity
let isServerConnected = false;
const checkServerConnectivity = async () => {
  try {
    // Use the root endpoint instead of /health which doesn't exist
    const response = await fetch(`${API_URL.replace("/api", "")}`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok || response.status === 404) {
      // Even a 404 means server is running
      console.log("API server is reachable");
      isServerConnected = true;
      return true;
    } else {
      console.warn(`API server returned status ${response.status}`);
      isServerConnected = false;
      return false;
    }
  } catch (error) {
    console.error("Cannot reach API server:", error);
    isServerConnected = false;
    return false;
  }
};

// Run initial connectivity check
checkServerConnectivity().then((isConnected) => {
  if (!isConnected) {
    console.error(
      "⚠️ API server connectivity check failed. Some features may not work."
    );
  }
});

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const isAuthenticated = state.session?.isAuthenticated;
    const accessToken = state.accessToken?.token;
    const accessTokenExpiresAt = state.accessToken?.expiresAt;

    // Add request timestamp for debugging
    config.metadata = {
      ...config.metadata,
      startTime: new Date().getTime(),
    };

    // Check if token has expired
    const isTokenExpired = accessTokenExpiresAt
      ? Date.now() > accessTokenExpiresAt - 10000
      : true;

    // Check if we're dealing with a password-related endpoint
    const isPasswordEndpoint = config.url?.includes("/passwords");

    // Log the request for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      hasAuth: isAuthenticated && !!accessToken,
      isTokenExpired: accessToken ? isTokenExpired : "N/A",
      data: config.data ? "Present" : "None",
      isPasswordEndpoint,
    });

    // Log request data for password endpoints in development
    if (isPasswordEndpoint && config.data) {
      console.log("Password request data:", {
        title: config.data.title,
        username: config.data.username
          ? `${config.data.username.substring(0, 3)}...`
          : "None",
        hasPassword: !!config.data.password,
        category: config.data.category,
      });
    }

    // Only add Authorization header if we have a token and we're authenticated
    if (isAuthenticated && accessToken && !isTokenExpired) {
      console.log("Adding Authorization header with access token");
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else if (
      config.url !== "/auth/login" &&
      config.url !== "/auth/register" &&
      config.url !== "/auth/refresh"
    ) {
      // Check if token is expired
      if (accessToken && isTokenExpired) {
        console.warn("Request with expired access token:", config.url);
      } else if (!accessToken && isAuthenticated) {
        console.error(
          "No access token despite authenticated state for:",
          config.url
        );
      } else if (!isAuthenticated) {
        console.warn("Request without authentication:", config.url);
      }
    }

    // Double-check that password endpoints always have auth
    if (isPasswordEndpoint) {
      // Forcefully check if the Authorization header is set
      const hasAuthHeader =
        config.headers?.Authorization || config.headers?.authorization;

      if (!hasAuthHeader) {
        console.error("🚨 Password endpoint missing Authorization header!");

        // Try to add it if we have a token
        if (accessToken) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${accessToken}`;
          console.log("Forced Authorization header for password endpoint");
        } else {
          console.error("Cannot add Authorization header - no token available");
        }
      }
    }

    return config;
  },
  (error) => {
    console.error("Request preparation error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate response time for debugging
    const config = response.config;
    const startTime = config.metadata?.startTime;
    if (startTime) {
      const endTime = new Date().getTime();
      const duration = endTime - startTime;
      console.log(
        `API Response: ${
          response.status
        } in ${duration}ms for ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    // Check if we're dealing with a password-related response
    const isPasswordResponse = config.url?.includes("/passwords");
    if (isPasswordResponse) {
      // For password responses, log some info without sensitive data
      if (Array.isArray(response.data)) {
        console.log(
          `Password response: ${response.data.length} passwords returned`
        );
      } else if (response.data) {
        console.log("Password response:", {
          id: response.data.id,
          title: response.data.title,
          success: true,
        });
      }
    }

    return response;
  },
  async (error: AxiosError) => {
    // Check if the error is due to server connectivity
    if (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK") {
      console.error("Network error detected. Checking server connectivity...");
      await checkServerConnectivity();

      if (!isServerConnected) {
        return Promise.reject(
          new Error(
            "Cannot connect to the server. Please check your internet connection and try again."
          )
        );
      }
    }

    // Log detailed error information to help debugging
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      isAxiosError: error.isAxiosError,
      hasAuthHeader: error.config?.headers?.Authorization ? "Yes" : "No",
    });

    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const state = store.getState();
        const refreshToken = state.refreshToken?.token;
        const refreshTokenExpiresAt = state.refreshToken?.expiresAt;

        // Check if refresh token is available and not expired
        if (
          !refreshToken ||
          (refreshTokenExpiresAt && Date.now() > refreshTokenExpiresAt)
        ) {
          // No valid refresh token, user needs to login again
          console.warn(
            "Authentication failed and no valid refresh token available"
          );
          handleLogout();
          return Promise.reject(
            new Error("Your session has expired. Please log in again.")
          );
        }

        console.log("Attempting to refresh authentication token");

        // Attempt to refresh the token
        const response = await authService.refreshToken(refreshToken);

        if (!response || !response.accessToken) {
          console.error("Token refresh failed: Invalid response");
          handleLogout();
          return Promise.reject(
            new Error("Authentication failed. Please log in again.")
          );
        }

        console.log("Token refresh successful");

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
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;

        // Retry the original request with new token
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Token refresh failed, logout user
        console.error("Token refresh failed:", refreshError);
        handleLogout();
        return Promise.reject(
          new Error("Authentication failed. Please log in again.")
        );
      }
    }

    // Special handling for password-related errors
    if (error.config?.url?.includes("/passwords")) {
      console.error("Password API error:", {
        method: error.config?.method,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        hasAuth: !!error.config?.headers?.Authorization,
      });
    }

    // Enhance error message for specific HTTP status codes
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 400:
          error.message =
            data.message ||
            data.error ||
            "Invalid request. Please check your data.";
          break;
        case 401:
          error.message = "Authentication required. Please log in.";
          break;
        case 403:
          error.message = "You don't have permission to access this resource.";
          break;
        case 404:
          error.message = "The requested resource was not found.";
          break;
        case 422:
          error.message = "Validation error. Please check your input.";
          break;
        case 500:
          error.message = "Server error. Please try again later.";
          break;
        default:
          error.message =
            data.message || "An error occurred. Please try again.";
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to handle logout
const handleLogout = () => {
  console.log("Logging out user due to authentication error");
  store.dispatch(clearSession());
  store.dispatch(clearUser());
  store.dispatch(clearRefreshToken());
  store.dispatch(clearAccessToken());
};

// Export connectivity checker for use in other components
export const checkConnection = checkServerConnectivity;

export default apiClient;
