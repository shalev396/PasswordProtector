import api from "@/api/api";
import { hashPassword } from "@/lib/crypto";

// Interfaces for authentication
interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

// In-memory storage for auth data - this will be lost on page reload
// but that's appropriate for sensitive data
let authData = {
  token: null as string | null,
  userData: null as {
    id: number;
    email: string;
    masterKey: string;
  } | null,
  isAuthenticated: false,
};

/**
 * Register a new user
 */
export const register = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    // Hash the password before sending to server
    const hashedPassword = await hashPassword(password, email);

    const response = await api.post<AuthResponse>("/auth/register", {
      email,
      password: hashedPassword,
    });

    // Store auth data in memory (will be lost on refresh, which is safer)
    authData = {
      token: response.data.token,
      userData: {
        id: response.data.user.id,
        email: response.data.user.email,
        masterKey: password, // The masterKey is the raw password used for encryption
      },
      isAuthenticated: true,
    };

    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Login a user
 */
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    // Hash the password before sending to server
    const hashedPassword = await hashPassword(password, email);

    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password: hashedPassword,
    });

    // Store auth data in memory (will be lost on refresh, which is safer)
    authData = {
      token: response.data.token,
      userData: {
        id: response.data.user.id,
        email: response.data.user.email,
        masterKey: password, // The masterKey is the raw password used for encryption
      },
      isAuthenticated: true,
    };

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
  // Clear in-memory auth data
  authData = {
    token: null,
    userData: null,
    isAuthenticated: false,
  };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return authData.isAuthenticated && !!authData.token;
};

/**
 * Get the current authenticated user's information
 */
export const getCurrentUser = () => {
  return authData.userData;
};

/**
 * Get auth token for API requests
 */
export const getToken = (): string | null => {
  return authData.token;
};

/**
 * Get the master password for encryption/decryption
 */
export const getMasterPassword = (): string | null => {
  return authData.userData?.masterKey || null;
};

export default {
  register,
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  getToken,
  getMasterPassword,
};
