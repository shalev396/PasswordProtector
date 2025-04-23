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
import { setRefreshToken } from "../redux/slices/refreshTokenSlice";
import {
  setAccessToken,
  clearAccessToken,
} from "../redux/slices/accessTokenSlice";

// Create helper functions for setting expiration timestamps
const setAccessTokenExpiresAt = (expiresAt: number) => {
  const accessToken = store.getState().accessToken.token;
  if (accessToken) {
    store.dispatch(setAccessToken({ token: accessToken, expiresAt }));
  }
};

const setRefreshTokenExpiresAt = (expiresAt: number) => {
  const refreshToken = store.getState().refreshToken.token;
  if (refreshToken) {
    store.dispatch(setRefreshToken({ token: refreshToken, expiresAt }));
  }
};

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

    // Only add Authorization header if we have a token and we're authenticated
    if (isAuthenticated && accessToken && !isTokenExpired) {
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

    // Check if we should attempt to refresh token
    if (
      error.response?.status === 401 &&
      error.config &&
      !error.config._retry && // Add null check
      error.config.url &&
      !error.config.url.includes("/auth/refresh") // Add null check
    ) {
      try {
        // Prevent infinite loop by checking if this request has already been retried
        if (
          error.config &&
          (error.config._retry ||
            (error.config.url && error.config.url.includes("/auth/refresh")))
        ) {
          console.error(
            "Request already retried or is a refresh request itself - preventing infinite loop"
          );
          logoutUserDueToAuthError(
            "Authentication failed. Please log in again."
          );
          return Promise.reject(error);
        }

        // Mark this request as retried
        if (error.config) {
          error.config._retry = true;
        }

        // Get current auth state
        const state = store.getState();
        const refreshToken = state.refreshToken?.token;

        // Check if refresh token exists
        if (!refreshToken) {
          console.error("No refresh token available");
          logoutUserDueToAuthError(
            "Your session has expired. Please log in again."
          );
          return Promise.reject(error);
        }

        try {
          const response = await apiClient.post("/auth/refresh", {
            refreshToken: refreshToken,
          });

          if (response.data) {
            // Update tokens in Redux store
            store.dispatch(
              setAccessToken({
                token: response.data.accessToken,
                expiresAt: response.data.accessTokenExpiresAt || null,
              })
            );

            if (response.data.accessTokenExpiresAt) {
              setAccessTokenExpiresAt(response.data.accessTokenExpiresAt);
            }

            if (response.data.refreshToken) {
              store.dispatch(
                setRefreshToken({
                  token: response.data.refreshToken,
                  expiresAt: response.data.refreshTokenExpiresAt || null,
                })
              );

              if (response.data.refreshTokenExpiresAt) {
                setRefreshTokenExpiresAt(response.data.refreshTokenExpiresAt);
              }
            }

            // Apply the new token to the Authorization header
            apiClient.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${response.data.accessToken}`;

            // Apply the new token to original request and retry
            if (error.config && error.config.headers) {
              error.config.headers[
                "Authorization"
              ] = `Bearer ${response.data.accessToken}`;

              // Return a new instance of the original request with the new token
              return error.config
                ? apiClient(error.config)
                : Promise.reject(error);
            } else {
              console.error("Cannot retry request - config or headers missing");
              return Promise.reject(error);
            }
          } else {
            console.error("Failed to refresh token - no data returned");
            logoutUserDueToAuthError(
              "Authentication failed. Please log in again."
            );
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          logoutUserDueToAuthError(
            "Authentication error. Please log in again."
          );
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        logoutUserDueToAuthError("Authentication error. Please log in again.");
        return Promise.reject(error);
      }
    }

    // Special handling for password-related errors
    if (error.config?.url?.includes("/passwords")) {
      const errorData = error.response?.data as any;
      console.error("Password API error:", {
        method: error.config?.method,
        status: error.response?.status,
        message: errorData?.message || error.message,
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
  store.dispatch(clearSession());
  store.dispatch(clearUser());
  store.dispatch(clearRefreshToken());
  store.dispatch(clearAccessToken());
};

// Function to handle logout with error message
const logoutUserDueToAuthError = (errorMessage: string) => {
  console.error(`Auth Error: ${errorMessage}`);
  // Display error message to user if toast notification system exists
  if (typeof window !== "undefined" && window.alert) {
    // This is a fallback - ideally you'd use a toast notification system
    window.alert(errorMessage);
  }
  handleLogout();
};

// Export connectivity checker for use in other components
export const checkConnection = checkServerConnectivity;

export default apiClient;

/**
 * Refresh access token
 */
export const refreshAccessToken = async () => {
  try {
    // Get the refresh token from the store
    const { token: refreshToken } = store.getState().refreshToken || {};

    if (!refreshToken) {
      console.error("No refresh token available");
      store.dispatch(clearSession());
      return null;
    }

    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken: refreshToken,
    });

    if (response.data) {
      store.dispatch(setAccessToken(response.data.accessToken));
      return response.data.accessToken;
    } else {
      console.error(
        "Refresh response did not contain access token",
        response.data
      );
      store.dispatch(clearSession());
      return null;
    }
  } catch (error: any) {
    console.error("Failed to refresh access token:", error);

    // Log detailed error information for debugging
    if (error.response) {
      console.error("Refresh token error details:", {
        status: error.response.status,
        message: error.response.data?.message || "Unknown error",
        url: error.config?.url,
      });
    } else if (error.request) {
      console.error("No response received for refresh token request", {
        url: error.config?.url || "/auth/refresh",
      });
    }

    // Clear session on refresh failure
    store.dispatch(clearSession());
    return null;
  }
};
