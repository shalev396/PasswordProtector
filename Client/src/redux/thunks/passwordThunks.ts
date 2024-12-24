import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  passwordAPI,
  encryptPasswordData,
  decryptPasswordData,
  getMasterKey,
} from "@/services/api.service";
import {
  setPasswords,
  addPassword,
  updatePassword as updatePasswordAction,
  deletePassword as deletePasswordAction,
  setLoading,
  setError,
} from "@/redux/slices/passwordSlice";
import { Password } from "@/redux/slices/passwordSlice";

// Fetch all passwords
export const fetchPasswords = createAsyncThunk(
  "passwords/fetchAll",
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));

      const masterKey = getMasterKey();
      if (!masterKey) {
        throw new Error("Master key not found");
      }

      const encryptedPasswords = await passwordAPI.getAllPasswords();

      // Decrypt passwords
      const decryptedPasswords = encryptedPasswords.map(
        (encryptedPassword: any) =>
          decryptPasswordData(encryptedPassword, masterKey)
      );

      dispatch(setPasswords(decryptedPasswords));
      dispatch(setLoading(false));

      return decryptedPasswords;
    } catch (error: any) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
      throw error;
    }
  }
);

// Create new password
export const createPassword = createAsyncThunk(
  "passwords/create",
  async (passwordData: Omit<Password, "id">, { dispatch }) => {
    try {
      dispatch(setLoading(true));

      const masterKey = getMasterKey();
      if (!masterKey) {
        throw new Error("Master key not found");
      }

      // Encrypt password before sending to server
      const encryptedData = encryptPasswordData(passwordData, masterKey);

      // Send to server - type cast to any to avoid TS errors
      const response = await passwordAPI.createPassword(encryptedData as any);

      // Add decrypted password to store
      const newPassword = {
        ...response,
        password: passwordData.password, // Keep the original unencrypted password
      };

      dispatch(addPassword(newPassword));
      dispatch(setLoading(false));

      return newPassword;
    } catch (error: any) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
      throw error;
    }
  }
);

// Update existing password
export const updatePassword = createAsyncThunk(
  "passwords/update",
  async (
    { id, passwordData }: { id: string; passwordData: Partial<Password> },
    { dispatch }
  ) => {
    try {
      dispatch(setLoading(true));

      const masterKey = getMasterKey();
      if (!masterKey) {
        throw new Error("Master key not found");
      }

      // Encrypt password if it's included in the update
      const dataToUpdate = passwordData.password
        ? encryptPasswordData(passwordData, masterKey)
        : passwordData;

      // Send to server
      const response = await passwordAPI.updatePassword(
        id,
        dataToUpdate as any
      );

      // Update with decrypted data
      const updatedPassword = {
        ...response,
        id,
        ...(passwordData.password && { password: passwordData.password }),
      };

      dispatch(updatePasswordAction(updatedPassword));
      dispatch(setLoading(false));

      return updatedPassword;
    } catch (error: any) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
      throw error;
    }
  }
);

// Delete password
export const deletePassword = createAsyncThunk(
  "passwords/delete",
  async (id: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));

      // Delete from server
      await passwordAPI.deletePassword(id);

      // Remove from store
      dispatch(deletePasswordAction(id));
      dispatch(setLoading(false));

      return id;
    } catch (error: any) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
      throw error;
    }
  }
);
