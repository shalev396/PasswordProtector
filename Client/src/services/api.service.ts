import api from "@/api/api";
import { Password } from "@/types";
import { encryptPassword, decryptPassword } from "@/lib/crypto";
import { RootState } from "@/redux/store";
import { store } from "@/redux/store";

// Auth API Calls
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  register: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/register", { email, password });
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },
};

// Password API Calls
export const passwordAPI = {
  getAllPasswords: async () => {
    try {
      const response = await api.get("/passwords");
      return response.data;
    } catch (error) {
      console.error("Error fetching passwords:", error);
      throw error;
    }
  },

  getPassword: async (id: string) => {
    try {
      const response = await api.get(`/passwords/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching password ${id}:`, error);
      throw error;
    }
  },

  createPassword: async (passwordData: Omit<Password, "id">) => {
    try {
      const response = await api.post("/passwords", passwordData);
      return response.data;
    } catch (error) {
      console.error("Error creating password:", error);
      throw error;
    }
  },

  updatePassword: async (id: string, passwordData: Partial<Password>) => {
    try {
      const response = await api.put(`/passwords/${id}`, passwordData);
      return response.data;
    } catch (error) {
      console.error(`Error updating password ${id}:`, error);
      throw error;
    }
  },

  deletePassword: async (id: string) => {
    try {
      const response = await api.delete(`/passwords/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting password ${id}:`, error);
      throw error;
    }
  },
};

// Helper function to encrypt password before sending to server
export const encryptPasswordData = (
  passwordData: Partial<Password>,
  masterKey: string
): Partial<Password> & { encryptedPassword: string } => {
  // Use Promise handling for the async encryptPassword function
  const encryptedPassword = String(
    encryptPassword(passwordData.password!, masterKey)
  );

  // Create a new object without the plaintext password
  const { password, ...rest } = passwordData;

  return {
    ...rest,
    encryptedPassword,
  };
};

// Helper function to decrypt password data received from server
export const decryptPasswordData = (data: any, masterKey: string): Password => {
  return {
    ...data,
    password: decryptPassword(data.encryptedPassword, masterKey),
  };
};

// Function to get master key from Redux store
export const getMasterKey = (): string | null => {
  const state = store.getState() as RootState;
  return state.user?.user?.masterKey || null;
};

// Export a placeholder API version
export const VERSION = "1.0.0";
