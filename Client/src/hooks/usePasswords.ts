import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPasswordsLoading,
  setPasswordsError,
  setPasswords,
  addPasswordToStore,
  removePasswordFromStore,
} from "@/redux/slices/passwordSlice";
import passwordService from "@/services/passwordService";
import { useAuth } from "@/hooks/useAuth";
import { RootState } from "@/types/redux";
import { Password } from "@/types";
import { encryptPassword } from "@/lib/crypto";
import { store } from "@/redux/store";

// Define the interface for password with optional encrypted version
interface PasswordWithEncrypted extends Omit<Password, "id"> {
  id?: number;
  encryptedPassword?: string;
}

/**
 * Custom hook for password management functionality
 */
export const usePasswords = () => {
  const dispatch = useDispatch();
  const { accessToken, getMasterPassword } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  // Get passwords state from Redux
  const passwords = useSelector(
    (state: RootState) => state.passwords?.passwords ?? []
  );
  const isLoading = useSelector(
    (state: RootState) => state.passwords?.isLoading ?? false
  );
  const error = useSelector(
    (state: RootState) => state.passwords?.error ?? null
  );

  // Set up authentication header when token changes
  useEffect(() => {
    if (accessToken) {
      passwordService.setAuthHeader(accessToken);
    } else {
      console.warn("No access token available for passwordService");
      passwordService.setAuthHeader(null);
    }
  }, [accessToken]);

  // Ensure authentication before making API calls
  const ensureAuthenticated = () => {
    // Get token both from current hook state and from Redux store directly
    // in case there's a synchronization issue
    const reduxAccessToken = store.getState().accessToken?.token;
    const currentAccessToken = accessToken;

    // Use whichever token is available
    const token = currentAccessToken || reduxAccessToken;

    if (!token) {
      console.error("No access token available for API request");
      throw new Error("Authentication required");
    }

    // Explicitly set the auth header for this request

    passwordService.setAuthHeader(token);
    return token;
  };

  /**
   * Fetch all passwords for the current user
   */
  const fetchPasswords = useCallback(async () => {
    try {
      dispatch(setPasswordsLoading(true));
      dispatch(setPasswordsError(null));
      setLocalError(null);

      // Ensure we're authenticated
      ensureAuthenticated();

      // Get master password for decryption
      const masterKey = getMasterPassword();
      if (!masterKey) {
        const errorMsg = "Master password is required to decrypt passwords";
        console.error(errorMsg);
        dispatch(setPasswordsError(errorMsg));
        setLocalError(errorMsg);
        return [];
      }

      const passwordsData = await passwordService.getAllPasswords();

      // Process passwords (potentially decrypt them)
      const processedPasswords = passwordsData.map((pwd) => ({ ...pwd }));

      dispatch(setPasswords(processedPasswords));
      dispatch(setPasswordsLoading(false));

      return processedPasswords;
    } catch (error: any) {
      console.error("Error fetching passwords:", error);
      const errorMessage = error?.message || "Failed to fetch passwords";
      dispatch(setPasswordsError(errorMessage));
      dispatch(setPasswordsLoading(false));
      setLocalError(errorMessage);
      return [];
    }
  }, [dispatch, getMasterPassword, ensureAuthenticated]);

  /**
   * Add a new password
   */
  const addPassword = async (
    passwordData: PasswordWithEncrypted
  ): Promise<Password> => {
    try {
      dispatch(setPasswordsLoading(true));

      // Check authentication
      const token = ensureAuthenticated();

      // Get master key for encryption
      const masterKey = getMasterPassword();
      if (!masterKey) {
        console.error("Master key not available");
        throw new Error("Master key required for password encryption");
      }

      // Encrypt password if provided
      let encryptedPassword: string | undefined;
      if (passwordData.password) {
        try {
          encryptedPassword = await encryptPassword(
            passwordData.password,
            masterKey
          );
        } catch (encryptError) {
          console.error("Failed to encrypt password:", encryptError);
          throw new Error("Password encryption failed");
        }
      }

      // Prepare data for API
      const dataToSend: Partial<Password> = {
        ...passwordData,
        // Use encrypted password if available
        password: encryptedPassword || passwordData.encryptedPassword,
      };

      // Remove the plain text password and the encryptedPassword field
      delete (dataToSend as any).encryptedPassword;

      // Make API call with explicit authentication
      passwordService.setAuthHeader(token);

      // Detailed API call with logging

      const response = await passwordService.createPassword(dataToSend);

      // Add the new password to state
      dispatch(addPasswordToStore(response));

      return response;
    } catch (error: any) {
      console.error("API error when creating password:", error);

      // Detailed error logging for debugging
      if (error.response) {
      } else {
        // Network error or other non-response error
        console.error("Network or connection error:", {
          message: error.message,
          code: error.code,
          name: error.name,
          isAxiosError: error.isAxiosError,
        });
      }

      // Set specific Redux error
      dispatch(
        setPasswordsError(error.response?.data?.message || error.message)
      );
      throw new Error(error.response?.data?.message || error.message);
    } finally {
      dispatch(setPasswordsLoading(false));
    }
  };

  /**
   * Delete a password by ID
   */
  const deletePassword = useCallback(
    async (passwordId: number) => {
      try {
        dispatch(setPasswordsLoading(true));
        setLocalError(null);

        // Ensure we're authenticated
        ensureAuthenticated();

        await passwordService.deletePassword(passwordId);

        // Remove the password from the store
        dispatch(removePasswordFromStore(passwordId));
        dispatch(setPasswordsLoading(false));
        return true;
      } catch (error: any) {
        console.error(`Error deleting password ${passwordId}:`, error);
        const errorMessage = error.message || "Failed to delete password";
        dispatch(setPasswordsError(errorMessage));
        setLocalError(errorMessage);
        dispatch(setPasswordsLoading(false));
        return false;
      }
    },
    [dispatch, ensureAuthenticated]
  );

  return {
    passwords,
    isLoading,
    error: error || localError,
    fetchPasswords,
    addPassword,
    deletePassword,
  };
};

export default usePasswords;
