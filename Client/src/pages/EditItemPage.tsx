import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ItemForm } from "@/components/ItemForm";
import { useAuth } from "@/hooks/useAuth";
import { Password } from "@/types";
import { usePasswords } from "@/hooks/usePasswords";
import { decryptPassword } from "@/lib/crypto";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";

export default function EditItemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, isTokenValid, getMasterPassword, ensureAuthHeader } =
    useAuth();
  const { updatePasswordMutation, getPasswordById } = usePasswords();

  const [error, setError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [initialData, setInitialData] = useState<Partial<Password> | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch password data on component mount
  useEffect(() => {
    const loadPasswordData = async () => {
      if (!isAuthenticated || !id) {
        console.warn(
          "User not authenticated or missing ID, redirecting to login"
        );
        navigate("/login");
        return;
      }

      try {
        // Ensure auth header is set
        if (ensureAuthHeader) {
          ensureAuthHeader();
        }

        // Get the password data
        const passwordData = await getPasswordById(Number(id));

        if (!passwordData) {
          console.error("Password not found");
          setError("Password not found");
          navigate("/dashboard");
          return;
        }

        // Decrypt the password if it's encrypted
        let decryptedData = { ...passwordData };
        if (passwordData.password) {
          try {
            const masterKey = getMasterPassword();
            if (masterKey && passwordData.password) {
              const decrypted = await decryptPassword(
                passwordData.password,
                masterKey
              );
              decryptedData.password = decrypted;
            }
          } catch (decryptError) {
            console.error("Failed to decrypt password:", decryptError);
            setError(
              "Could not decrypt password. Please check your master password."
            );
          }
        }

        // Set the initial data just once when the component mounts
        setInitialData(decryptedData);
      } catch (err: any) {
        console.error("Error loading password:", err);
        setError(err?.message || "Failed to load password data");
      } finally {
        setIsLoading(false);
      }
    };

    loadPasswordData();
  }, [
    id,
    isAuthenticated,
    navigate,
    getPasswordById,
    ensureAuthHeader,
    getMasterPassword,
  ]);

  const handleSubmit = async (data: Partial<Password>) => {
    if (!isAuthenticated || !isTokenValid || !id) {
      navigate("/login");
      return;
    }

    try {
      setError(null);

      // Ensure we have the auth header set
      if (ensureAuthHeader) {
        ensureAuthHeader();
      }

      // Make sure we're using the updated password from the form
      const updatedPasswordData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      // Use the updatePasswordMutation which should handle optimistic updates
      await updatePasswordMutation.mutateAsync({
        id: Number(id),
        passwordData: updatedPasswordData,
      });

      // Explicitly invalidate the passwords list query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.passwords.lists() });

      setSubmitSuccess(true);
      // Navigate back to dashboard after successful update
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Failed to update password:", err);
      setError(err?.message || "Failed to update password. Please try again.");
      setSubmitSuccess(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <ItemForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={updatePasswordMutation.isPending}
      error={error}
      submitSuccess={submitSuccess}
    />
  );
}
