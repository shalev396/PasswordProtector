import axios from "axios";
import { encryptPassword, decryptPassword } from "@/lib/crypto";
import { getToken, getMasterPassword } from "./authService";

// API base URL - should match the one in authService
const API_URL = "http://localhost:5000/api";

// Create axios instance with default configs
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define the password interface
export interface Password {
  id?: string;
  title: string;
  username?: string;
  password: string;
  url?: string;
  category?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Get all passwords for the authenticated user
 */
export const getPasswords = async (): Promise<Password[]> => {
  try {
    const response = await api.get("/passwords");
    const passwords = response.data;

    // Decrypt the passwords
    const masterPassword = getMasterPassword();
    if (!masterPassword) throw new Error("Master password not found");

    return passwords.map((encryptedPwd: any) => ({
      ...encryptedPwd,
      password: decryptPassword(encryptedPwd.encryptedPassword, masterPassword),
    }));
  } catch (error) {
    console.error("Error fetching passwords:", error);
    throw error;
  }
};

/**
 * Create a new password
 */
export const createPassword = async (password: Password): Promise<Password> => {
  try {
    // Encrypt the password before sending to server
    const masterPassword = getMasterPassword();
    if (!masterPassword) throw new Error("Master password not found");

    const encryptedPassword = encryptPassword(
      password.password,
      masterPassword
    );

    const response = await api.post("/passwords", {
      ...password,
      encryptedPassword,
      // Don't send the plaintext password to the server
      password: undefined,
    });

    return {
      ...response.data,
      password: password.password,
    };
  } catch (error) {
    console.error("Error creating password:", error);
    throw error;
  }
};

/**
 * Update an existing password
 */
export const updatePassword = async (password: Password): Promise<Password> => {
  try {
    if (!password.id) {
      throw new Error("Password ID is required for update");
    }

    // Encrypt the password before sending to server
    const masterPassword = getMasterPassword();
    if (!masterPassword) throw new Error("Master password not found");

    const encryptedPassword = encryptPassword(
      password.password,
      masterPassword
    );

    const response = await api.put(`/passwords/${password.id}`, {
      ...password,
      encryptedPassword,
      // Don't send the plaintext password to the server
      password: undefined,
    });

    return {
      ...response.data,
      password: password.password,
    };
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

/**
 * Delete a password
 */
export const deletePassword = async (id: string): Promise<void> => {
  try {
    await api.delete(`/passwords/${id}`);
  } catch (error) {
    console.error("Error deleting password:", error);
    throw error;
  }
};

export default {
  getPasswords,
  createPassword,
  updatePassword,
  deletePassword,
};
