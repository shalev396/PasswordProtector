import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import passwordService from "@/services/passwordService";
import { useAuth } from "@/hooks/useAuth";
import { Password } from "@/types";
import { encryptPassword } from "@/lib/crypto";
import { queryKeys } from "@/lib/queryClient";

// Define the interface for password with optional encrypted version
interface PasswordWithEncrypted extends Omit<Password, "id"> {
  id?: number;
  encryptedPassword?: string;
}

/**
 * Custom hook for password management functionality using React Query
 */
export const usePasswords = () => {
  const queryClient = useQueryClient();
  const { accessToken, getMasterPassword } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  // Ensure authentication before making API calls
  const ensureAuthenticated = useCallback(() => {
    if (!accessToken) {
      console.error("No access token available for API request");
      throw new Error("Authentication required");
    }

    // Explicitly set the auth header for this request
    passwordService.setAuthHeader(accessToken);
    return accessToken;
  }, [accessToken]);

  // Fetch all passwords query
  const {
    data: passwords = [],
    isLoading,
    error,
    refetch: fetchPasswords,
  } = useQuery({
    queryKey: queryKeys.passwords.lists(),
    queryFn: async () => {
      try {
        // Ensure we're authenticated
        ensureAuthenticated();

        // Get master password for decryption
        const masterKey = getMasterPassword();
        if (!masterKey) {
          const errorMsg = "Master password is required to decrypt passwords";
          console.error(errorMsg);
          setLocalError(errorMsg);
          return [];
        }

        const passwordsData = await passwordService.getAllPasswords();

        // Process passwords (potentially decrypt them)
        const processedPasswords = passwordsData.map((pwd) => ({ ...pwd }));

        return processedPasswords;
      } catch (error: any) {
        console.error("Error fetching passwords:", error);
        const errorMessage = error?.message || "Failed to fetch passwords";
        setLocalError(errorMessage);
        throw error;
      }
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Function to get a password by ID
  const getPasswordById = async (id: number | string): Promise<Password> => {
    try {
      // Try to find the password in the cache first
      const cachedPasswords = queryClient.getQueryData<Password[]>(
        queryKeys.passwords.lists()
      );
      const cachedPassword = cachedPasswords?.find((p) => p.id === Number(id));

      if (cachedPassword) {
        return cachedPassword;
      }

      // If not in cache, fetch from API
      ensureAuthenticated();
      const response = await passwordService.getPasswordById(Number(id));
      return response;
    } catch (error: any) {
      console.error(`Error fetching password ${id}:`, error);
      throw error;
    }
  };

  // Add password mutation
  const addPasswordMutation = useMutation({
    mutationFn: async (
      passwordData: PasswordWithEncrypted
    ): Promise<Password> => {
      try {
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

        const response = await passwordService.createPassword(dataToSend);
        return response;
      } catch (error: any) {
        console.error("API error when creating password:", error);

        // Detailed error logging for debugging
        if (error.response) {
          console.error("API response error:", {
            status: error.response.status,
            data: error.response.data,
          });
        } else {
          // Network error or other non-response error
          console.error("Network or connection error:", {
            message: error.message,
            code: error.code,
            name: error.name,
            isAxiosError: error.isAxiosError,
          });
        }

        throw new Error(error.response?.data?.message || error.message);
      }
    },
    onSuccess: (newPassword) => {
      // Log current cache state for debugging
      console.debug(
        "Current passwords in cache before update:",
        queryClient.getQueryData<Password[]>(queryKeys.passwords.lists())
      );

      // Get the current password list
      const currentPasswords =
        queryClient.getQueryData<Password[]>(queryKeys.passwords.lists()) || [];

      // Update the cache optimistically
      queryClient.setQueryData(queryKeys.passwords.lists(), [
        ...currentPasswords,
        newPassword,
      ]);

      // Log updated cache for debugging
      console.debug(
        "Updated passwords in cache:",
        queryClient.getQueryData<Password[]>(queryKeys.passwords.lists())
      );

      // Force a refetch to ensure cache is in sync with server
      // This is important when adding new items as the optimistic update might miss some server-side processing
      queryClient.invalidateQueries({ queryKey: queryKeys.passwords.lists() });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async ({
      id,
      passwordData,
    }: {
      id: number;
      passwordData: Partial<Password>;
    }): Promise<Password> => {
      try {
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
          password:
            encryptedPassword || (passwordData as any).encryptedPassword,
        };

        // Remove the plain text password and encryptedPassword fields
        delete (dataToSend as any).encryptedPassword;

        // Make API call with explicit authentication
        passwordService.setAuthHeader(token);

        const response = await passwordService.updatePassword(id, dataToSend);
        return response;
      } catch (error: any) {
        console.error(`API error when updating password ${id}:`, error);
        throw new Error(error.response?.data?.message || error.message);
      }
    },
    onSuccess: (updatedPassword) => {
      // Get the current password list
      const currentPasswords =
        queryClient.getQueryData<Password[]>(queryKeys.passwords.lists()) || [];

      // Replace the updated password in the cache
      const updatedPasswords = currentPasswords.map((p) =>
        p.id === updatedPassword.id ? updatedPassword : p
      );

      // Update the cache with the new password list
      queryClient.setQueryData(queryKeys.passwords.lists(), updatedPasswords);
    },
  });

  // Delete password mutation
  const deletePasswordMutation = useMutation({
    mutationFn: async (passwordId: number): Promise<boolean> => {
      try {
        // Ensure we're authenticated
        ensureAuthenticated();

        await passwordService.deletePassword(passwordId);
        return true;
      } catch (error: any) {
        console.error(`Error deleting password ${passwordId}:`, error);
        const errorMessage = error.message || "Failed to delete password";
        setLocalError(errorMessage);
        throw error;
      }
    },
    onSuccess: (_, deletedId) => {
      // Get the current password list
      const currentPasswords =
        queryClient.getQueryData<Password[]>(queryKeys.passwords.lists()) || [];

      // Remove the deleted password from the cache
      const filteredPasswords = currentPasswords.filter(
        (p) => p.id !== deletedId
      );

      // Update the cache with the filtered password list
      queryClient.setQueryData(queryKeys.passwords.lists(), filteredPasswords);
    },
  });

  const addPassword = (data: PasswordWithEncrypted, options?: any) =>
    addPasswordMutation.mutate(data, options);

  const updatePassword = (
    data: { id: number; passwordData: Partial<Password> },
    options?: any
  ) => updatePasswordMutation.mutate(data, options);

  const deletePassword = (id: number, options?: any) =>
    deletePasswordMutation.mutate(id, options);

  return {
    passwords: passwords || [],
    isLoading,
    error: (error as Error)?.message || localError,
    fetchPasswords,
    addPassword,
    updatePassword,
    deletePassword,
    addPasswordMutation,
    updatePasswordMutation,
    deletePasswordMutation,
    getPasswordById,
  };
};

export default usePasswords;
