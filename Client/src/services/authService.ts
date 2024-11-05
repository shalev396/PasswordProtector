import axios from "axios";
import { generateEncryptionKey, hashPassword } from "@/lib/crypto";

// Define the base API URL
const API_URL = "http://localhost:5000/api";

// Create axios instance with default configs
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interfaces for authentication
interface RegisterRequest {
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

/**
 * Register a new user
 */
export const register = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    // Hash the password before sending to server
    const hashedPassword = await hashPassword(password, email);

    const response = await api.post<AuthResponse>("/auth/register", {
      email,
      password: hashedPassword,
    });

    // Save auth token in localStorage
    localStorage.setItem("token", response.data.token);

    // Store user data for encryption/decryption operations
    localStorage.setItem(
      "userData",
      JSON.stringify({
        id: response.data.user.id,
        email: response.data.user.email,
        masterKey: password, // The masterKey is the raw password used for encryption
      })
    );

    // Set authentication status
    sessionStorage.setItem("isAuthenticated", "true");

    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Login a user
 */
export const login = async (email: string, password: string): Promise<void> => {
  try {
    // Hash the password before sending to server
    const hashedPassword = await hashPassword(password, email);

    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password: hashedPassword,
    });

    // Save auth token in localStorage
    localStorage.setItem("token", response.data.token);

    // Store user data for encryption/decryption operations
    localStorage.setItem(
      "userData",
      JSON.stringify({
        id: response.data.user.id,
        email: response.data.user.email,
        masterKey: password, // The masterKey is the raw password used for encryption
      })
    );

    // Set authentication status
    sessionStorage.setItem("isAuthenticated", "true");

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Logout the current user
 */
export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
  sessionStorage.removeItem("isAuthenticated");
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  const isAuth = sessionStorage.getItem("isAuthenticated") === "true";
  return !!token && isAuth;
};

/**
 * Get the current authenticated user's information
 */
export const getCurrentUser = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

/**
 * Get auth token for API requests
 */
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

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

export default {
  register,
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  getToken,
};
