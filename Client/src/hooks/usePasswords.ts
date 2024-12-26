import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  addPassword as addPasswordAction,
  deletePassword as deletePasswordAction,
  setPasswords as setPasswordsAction,
  setLoading as setLoadingAction,
  setError as setErrorAction,
} from "@/redux/slices/passwordSlice";
import { Password } from "@/types";
import { useAuth } from "./useAuth";
import apiClient from "@/api/api";
import { encryptPassword, decryptPassword } from "@/lib/crypto";

/**
 * Custom hook for password management
 */
export interface PasswordWithEncrypted extends Password {
  encryptedPassword?: string;
}

export const usePasswords = () => {
  const dispatch = useDispatch();
  const { getMasterPassword, user } = useAuth();

  const passwords = useSelector(
    (state: RootState) => state.passwords.passwords
  );
  const isLoading = useSelector(
    (state: RootState) => state.passwords.isLoading
  );
  const error = useSelector((state: RootState) => state.passwords.error);

  /**
   * Fetch all passwords for the current user
   */
  const fetchPasswords = useCallback(async () => {
    try {
      dispatch(setLoadingAction(true));

      // Get the master key for decryption
      const masterKey = getMasterPassword();
      if (!masterKey) {
        throw new Error("Master key not found");
      }

      // Fetch the encrypted passwords from server
      const response = await apiClient.get<PasswordWithEncrypted[]>(
        "/passwords"
      );
      const encryptedPasswords = response.data;

      // Decrypt each password
      const decryptedPasswords = await Promise.all(
        encryptedPasswords.map(async (encryptedPassword) => {
          const decrypted: Password = {
            id: encryptedPassword.id!,
            title: encryptedPassword.title,
            username: encryptedPassword.username || "",
            password: encryptedPassword.encryptedPassword
              ? await decryptPassword(
                  encryptedPassword.encryptedPassword,
                  masterKey
                )
              : encryptedPassword.password,
            website: encryptedPassword.website || "",
            notes: encryptedPassword.notes,
            category: encryptedPassword.category || "",
            createdAt: encryptedPassword.createdAt || new Date().toISOString(),
            updatedAt: encryptedPassword.updatedAt || new Date().toISOString(),
            userId: encryptedPassword.userId || user?.id || 0,
          };

          return decrypted;
        })
      );

      // Update state with decrypted passwords
      dispatch(setPasswordsAction(decryptedPasswords));
      dispatch(setLoadingAction(false));
      return decryptedPasswords;
    } catch (err: any) {
      dispatch(setErrorAction(err.message || "Failed to fetch passwords"));
      dispatch(setLoadingAction(false));
      throw err;
    }
  }, [dispatch, getMasterPassword, user?.id]);

  /**
   * Add a new password
   */
  const addPassword = useCallback(
    async (password: Omit<Password, "id">) => {
      try {
        dispatch(setLoadingAction(true));

        // Get the master key for encryption
        const masterKey = getMasterPassword();
        if (!masterKey) {
          throw new Error("Master key not found");
        }

        // Encrypt the password before sending to server
        const encryptedPassword = await encryptPassword(
          password.password,
          masterKey
        );

        // Send to server
        const response = await apiClient.post("/passwords", {
          ...password,
          encryptedPassword,
          // Don't send plaintext password to server
          password: undefined,
        });

        // Add new password to state
        dispatch(
          addPasswordAction({
            ...response.data,
            // Keep plaintext password in local state only
            password: password.password,
          })
        );
        dispatch(setLoadingAction(false));
        return response.data;
      } catch (err: any) {
        dispatch(setErrorAction(err.message || "Failed to add password"));
        dispatch(setLoadingAction(false));
        throw err;
      }
    },
    [dispatch, getMasterPassword]
  );

  /**
   * Delete a password
   */
  const deletePassword = useCallback(
    async (id: number) => {
      try {
        await apiClient.delete(`/passwords/${id}`);
        dispatch(deletePasswordAction(id));
      } catch (err: any) {
        dispatch(setErrorAction(err.message || "Failed to delete password"));
        throw err;
      }
    },
    [dispatch]
  );

  return {
    passwords,
    isLoading,
    error,
    fetchPasswords,
    addPassword,
    deletePassword,
  };
};

export default usePasswords;
