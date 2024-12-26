import apiClient from "@/api/api";
import { AuthResponse, LoginCredentials, RegisterCredentials } from "@/types";

/**
 * Service for authentication-related API operations
 */
const authService = {
  /**
   * Set the auth header for API requests
   */
  setAuthHeader(token: string | null): void {
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common["Authorization"];
    }
  },

  /**
   * Log in a user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Register a new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/auth/register", credentials);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  /**
   * Refresh an access token using a refresh token
   */
  async refreshToken(token: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/auth/refresh-token", { token });
      return response.data;
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  },

  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
      // We still want to clear local state even if the API call fails
    }
  },

  /**
   * Get the current user's profile
   */
  async getUserProfile(): Promise<any> {
    try {
      const response = await apiClient.get("/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },
};

export default authService;
