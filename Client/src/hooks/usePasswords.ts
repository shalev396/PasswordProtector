import { useDispatch } from "react-redux";
import * as passwordService from "@/services/passwordService";
import {
  setPasswords,
  addPassword,
  updatePassword as updatePasswordAction,
  deletePassword as deletePasswordAction,
  setLoading,
  setError,
} from "@/redux/slices/passwordSlice";
import type { Password as ApiPassword } from "@/services/passwordService";

// Create adapter to ensure passwords from API match the Redux store type
const adaptPassword = (password: ApiPassword): any => {
  return {
    ...password,
    id: password.id || crypto.randomUUID(), // Ensure id is always defined
    url: password.url || "",
    title: password.title || "",
    username: password.username || "",
    category: password.category || "",
    createdAt: password.createdAt || new Date().toISOString(),
    updatedAt: password.updatedAt || new Date().toISOString(),
  };
};

export function usePasswords() {
  const dispatch = useDispatch();

  const fetchPasswords = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const passwords = await passwordService.getPasswords();
      const adaptedPasswords = passwords.map(adaptPassword);
      dispatch(setPasswords(adaptedPasswords));
      return passwords;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch passwords";
      dispatch(setError(errorMsg));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createPassword = async (passwordData: ApiPassword) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const newPassword = await passwordService.createPassword(passwordData);
      const adaptedPassword = adaptPassword(newPassword);
      dispatch(addPassword(adaptedPassword));
      return newPassword;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create password";
      dispatch(setError(errorMsg));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updatePassword = async (passwordData: ApiPassword) => {
    if (!passwordData.id) {
      throw new Error("Password ID is required for update");
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const updatedPassword = await passwordService.updatePassword(
        passwordData
      );
      const adaptedPassword = adaptPassword(updatedPassword);
      dispatch(updatePasswordAction(adaptedPassword));
      return updatedPassword;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update password";
      dispatch(setError(errorMsg));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deletePassword = async (id: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      await passwordService.deletePassword(id);
      dispatch(deletePasswordAction(id));
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete password";
      dispatch(setError(errorMsg));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    fetchPasswords,
    createPassword,
    updatePassword,
    deletePassword,
  };
}
