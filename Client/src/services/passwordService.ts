import apiClient from "@/api/api";
import { Password } from "@/types";

/**
 * Service for handling password-related API operations
 */
const passwordService = {
  /**
   * Set the auth header for API requests
   */
  setAuthHeader(token: string | null): void {
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Double-check that the header was set correctly
      const currentHeader = apiClient.defaults.headers.common["Authorization"];
      if (currentHeader) {
      } else {
        console.error("Failed to set Authorization header");
      }
    } else {
      console.warn("Removing Authorization header - no token provided");
      delete apiClient.defaults.headers.common["Authorization"];
    }
  },

  /**
   * Get all passwords for the authenticated user
   */
  async getAllPasswords(): Promise<Password[]> {
    try {
      const response = await apiClient.get("/passwords");
      return response.data.passwords;
    } catch (error) {
      console.error("Error fetching all passwords:", error);
      throw error;
    }
  },

  /**
   * Get a single password by its ID
   */
  async getPasswordById(id: number): Promise<Password> {
    try {
      const response = await apiClient.get(`/passwords/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching password with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new password
   */
  async createPassword(password: Partial<Password>): Promise<Password> {
    try {
      // Verify auth header is set
      const hasAuthHeader = apiClient.defaults.headers.common["Authorization"];
      if (!hasAuthHeader) {
        console.error("Authorization header missing in createPassword call");

        // Try to get token from Redux store as fallback
        const store = (await import("../redux/store")).store;
        const accessToken = store.getState().accessToken?.token;

        if (accessToken) {
          this.setAuthHeader(accessToken);
        } else {
          throw new Error("Authentication required");
        }
      }

      const response = await apiClient.post("/passwords", password);

      return response.data;
    } catch (error) {
      console.error("Error creating password:", error);
      throw error;
    }
  },

  /**
   * Update an existing password
   */
  async updatePassword(
    id: number,
    password: Partial<Password>
  ): Promise<Password> {
    try {
      const response = await apiClient.put(`/passwords/${id}`, password);
      return response.data;
    } catch (error) {
      console.error(`Error updating password with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a password
   */
  async deletePassword(id: number): Promise<void> {
    try {
      await apiClient.delete(`/passwords/${id}`);
    } catch (error) {
      console.error(`Error deleting password with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Search for passwords using a query string
   */
  async searchPasswords(query: string): Promise<Password[]> {
    try {
      const response = await apiClient.get(
        `/passwords/search?q=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error searching passwords with query "${query}":`, error);
      throw error;
    }
  },
};

export default passwordService;
