import { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setPasswords,
  setPasswordsLoading,
  setPasswordsError,
  addPasswordToStore,
  updatePasswordInStore,
  removePasswordFromStore,
} from "@/redux/slices/passwordSlice";
import { useAuth } from "@/hooks/useAuth";
import passwordService from "@/services/passwordService";
import { Password } from "@/types";
import { encryptPassword, decryptPassword } from "@/lib/crypto";

/**
 * Custom hook for password management functionality
 */
export const usePasswords = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, accessToken, getMasterPassword } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  // Get passwords state from Redux
  const passwords = useSelector(
    (state: RootState) => state.passwords.passwords
  );
  const isLoading = useSelector(
    (state: RootState) => state.passwords.isLoading
  );
  const error = useSelector((state: RootState) => state.passwords.error);

  // Set up authentication header when token changes
  useEffect(() => {
    if (accessToken) {
      console.log("Setting authentication header in usePasswords");
      passwordService.setAuthHeader(accessToken);
    } else {
      console.warn("No access token available for passwordService");
      passwordService.setAuthHeader(null);
    }
  }, [accessToken]);

  // Helper function to ensure authentication
  const ensureAuthenticated = useCallback(() => {
    if (!isAuthenticated || !accessToken) {
      const errorMsg = "Authentication required to manage passwords";
      console.error(errorMsg, { isAuthenticated, hasToken: !!accessToken });
      throw new Error(errorMsg);
    }

    // Explicitly set the auth header before each operation
    if (accessToken) {
      passwordService.setAuthHeader(accessToken);
    }

    return true;
  }, [isAuthenticated, accessToken]);

  /**
   * Fetch all passwords for the current user
   */
  const fetchPasswords = useCallback(async () => {
    try {
      console.log("Fetching passwords...");
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

      console.log("Fetching passwords from API...");
      const passwordsData = await passwordService.getAllPasswords();
      console.log(`Fetched ${passwordsData.length} passwords from API`);

      // Process passwords (potentially decrypt them)
      const processedPasswords = passwordsData.map((pwd) => ({ ...pwd }));

      console.log("Setting passwords in store");
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
  const addPassword = useCallback(
    async (passwordData: PasswordWithEncrypted) => {
      try {
        console.log("Starting addPassword process...");
        dispatch(setPasswordsLoading(true));
        setLocalError(null);

        // Ensure we're authenticated
        try {
          ensureAuthenticated();
          console.log("Authentication confirmed for adding password");
        } catch (authError: any) {
          console.error("Authentication error in addPassword:", authError);
          dispatch(setPasswordsError(authError.message));
          setLocalError(authError.message);
          dispatch(setPasswordsLoading(false));
          throw authError;
        }

        // Get master password for encryption
        const masterKey = getMasterPassword();
        if (!masterKey) {
          const error = new Error(
            "Master password is required to encrypt passwords"
          );
          console.error(error.message);
          dispatch(setPasswordsError(error.message));
          setLocalError(error.message);
          dispatch(setPasswordsLoading(false));
          throw error;
        }

        let encryptedPwd = passwordData.password;

        // Only encrypt if it's a sensitive password and not already encrypted
        if (passwordData.password && !passwordData.encryptedPassword) {
          try {
            console.log("Encrypting password with master key...");
            encryptedPwd = await encryptPassword(
              passwordData.password,
              masterKey
            );
            console.log("Password encrypted successfully");
          } catch (encryptError: any) {
            console.error("Failed to encrypt password:", encryptError);
            dispatch(
              setPasswordsError(`Encryption failed: ${encryptError.message}`)
            );
            setLocalError(`Encryption failed: ${encryptError.message}`);
            dispatch(setPasswordsLoading(false));
            throw encryptError;
          }
        } else if (passwordData.encryptedPassword) {
          console.log("Using pre-encrypted password");
          encryptedPwd = passwordData.encryptedPassword;
        }

        // Prepare the data to send to API
        const passwordToSave = {
          ...passwordData,
          password: encryptedPwd,
        };

        delete passwordToSave.encryptedPassword; // Remove the extra field

        console.log("Calling API to create password:", {
          title: passwordToSave.title,
          category: passwordToSave.category,
          hasEncryptedPassword: !!encryptedPwd,
        });

        // Make the API call with explicit headers
        try {
          const createdPassword = await passwordService.createPassword(
            passwordToSave
          );
          console.log("Password created successfully:", createdPassword.id);

          // Add the password to the store
          dispatch(addPasswordToStore(createdPassword));
          dispatch(setPasswordsLoading(false));
          return createdPassword;
        } catch (apiError: any) {
          console.error("API error when creating password:", apiError);
          const errorMessage =
            apiError?.response?.data?.message ||
            apiError?.message ||
            "Failed to save password";

          console.error("API Error Details:", {
            status: apiError?.response?.status,
            statusText: apiError?.response?.statusText,
            message: errorMessage,
            hasToken: !!accessToken,
            isAuthenticated,
          });

          dispatch(setPasswordsError(errorMessage));
          setLocalError(errorMessage);
          dispatch(setPasswordsLoading(false));
          throw new Error(errorMessage);
        }
      } catch (error: any) {
        console.error("Error in addPassword:", error);
        const errorMessage = error.message || "An unknown error occurred";
        dispatch(setPasswordsError(errorMessage));
        setLocalError(errorMessage);
        dispatch(setPasswordsLoading(false));
        throw error;
      }
    },
    [
      dispatch,
      getMasterPassword,
      ensureAuthenticated,
      accessToken,
      isAuthenticated,
    ]
  );

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

        console.log(`Deleting password with ID: ${passwordId}`);
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
