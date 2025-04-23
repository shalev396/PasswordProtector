import { createAsyncThunk } from "@reduxjs/toolkit";
import { Password } from "../../types";
import passwordService from "../../services/passwordService";
import {
  setPasswords,
  addPassword,
  updatePassword as updatePasswordAction,
  deletePassword as deletePasswordAction,
  setLoading,
  setError,
  setCurrentPassword,
} from "../slices/passwordSlice";

// Fetch all passwords
export const fetchPasswords = createAsyncThunk(
  "passwords/fetchAll",
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await passwordService.getAllPasswords();

      // Ensure the response matches our Password type
      const typedPasswords: Password[] = response.map((pwd) => ({
        id: Number(pwd.id),
        title: pwd.title,
        username: pwd.username,
        password: pwd.password,
        website: pwd.website || "",
        category: pwd.category || "",
        notes: pwd.notes,
        createdAt: pwd.createdAt || new Date().toISOString(),
        updatedAt: pwd.updatedAt || new Date().toISOString(),
        userId: Number(pwd.userId) || 0,
      }));

      dispatch(setPasswords(typedPasswords));
      return typedPasswords;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch passwords";
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Fetch a single password by ID
export const fetchPasswordById = createAsyncThunk(
  "passwords/fetchById",
  async (id: number, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const pwd = await passwordService.getPasswordById(id);

      // Ensure the response matches our Password type
      const typedPassword: Password = {
        id: Number(pwd.id),
        title: pwd.title,
        username: pwd.username,
        password: pwd.password,
        website: pwd.website || "",
        category: pwd.category || "",
        notes: pwd.notes,
        createdAt: pwd.createdAt || new Date().toISOString(),
        updatedAt: pwd.updatedAt || new Date().toISOString(),
        userId: Number(pwd.userId) || 0,
      };

      dispatch(setCurrentPassword(typedPassword));
      return typedPassword;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        `Failed to fetch password with ID: ${id}`;
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Create a new password
export const createPassword = createAsyncThunk(
  "passwords/create",
  async (password: Omit<Password, "id">, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await passwordService.createPassword(password);

      // Ensure the response matches our Password type
      const typedPassword: Password = {
        id: Number(response.id),
        title: response.title,
        username: response.username,
        password: response.password,
        website: response.website || "",
        category: response.category || "",
        notes: response.notes,
        createdAt: response.createdAt || new Date().toISOString(),
        updatedAt: response.updatedAt || new Date().toISOString(),
        userId: Number(response.userId) || 0,
      };

      dispatch(addPassword(typedPassword));
      return typedPassword;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create password";
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Update an existing password
export const updatePassword = createAsyncThunk(
  "passwords/update",
  async (
    { id, password }: { id: number; password: Partial<Password> },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await passwordService.updatePassword(id, password);

      // Ensure the response matches our Password type
      const typedPassword: Password = {
        id: Number(response.id),
        title: response.title,
        username: response.username,
        password: response.password,
        website: response.website || "",
        category: response.category || "",
        notes: response.notes,
        createdAt: response.createdAt || new Date().toISOString(),
        updatedAt: response.updatedAt || new Date().toISOString(),
        userId: Number(response.userId) || 0,
      };

      dispatch(updatePasswordAction(typedPassword));
      return typedPassword;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        `Failed to update password with ID: ${id}`;
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Delete a password
export const deletePassword = createAsyncThunk(
  "passwords/delete",
  async (id: number, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      await passwordService.deletePassword(id);

      dispatch(deletePasswordAction(id));
      return id;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        `Failed to delete password with ID: ${id}`;
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Search passwords
export const searchPasswords = createAsyncThunk(
  "passwords/search",
  async (query: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await passwordService.searchPasswords(query);

      // Ensure the response matches our Password type
      const typedPasswords: Password[] = response.map((pwd) => ({
        id: Number(pwd.id),
        title: pwd.title,
        username: pwd.username,
        password: pwd.password,
        website: pwd.website || "",
        category: pwd.category || "",
        notes: pwd.notes,
        createdAt: pwd.createdAt || new Date().toISOString(),
        updatedAt: pwd.updatedAt || new Date().toISOString(),
        userId: Number(pwd.userId) || 0,
      }));

      dispatch(setPasswords(typedPasswords));
      return typedPasswords;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to search passwords";
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);
