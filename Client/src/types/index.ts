// User types
export interface User {
  id: number;
  name: string;
  email: string;
  masterKey?: string; // Used for password encryption/decryption
}

// Password types
export interface Password {
  id: number;
  title: string;
  username: string;
  password: string;
  encryptedPassword?: string; // The encrypted version of the password
  website: string;
  category: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt?: number; // Unix timestamp in milliseconds
  refreshTokenExpiresAt?: number; // Unix timestamp in milliseconds
}

// Redux state types
export interface UserState {
  user: User | null;
}

export interface SessionState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface TokenState {
  token: string | null;
  expiresAt: number | null; // Unix timestamp in milliseconds
}

export interface RefreshTokenState {
  token: string | null;
  expiresAt: number | null; // Unix timestamp in milliseconds
}

export interface PasswordState {
  passwords: Password[];
  filteredPasswords: Password[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  sortOption: "newest" | "oldest" | "alphabetical";
  currentPassword: Password | null;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
