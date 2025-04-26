import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePasswords } from "@/hooks/usePasswords";
import { ItemForm } from "@/components/ItemForm";
import { Password } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";

export default function AddItemPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user, accessToken, isTokenValid, ensureAuthHeader } =
    useAuth();
  const { addPasswordMutation, fetchPasswords } = usePasswords();

  const [error, setError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      console.warn("User not authenticated, redirecting to login");
      navigate("/login");
    }
  }, [isAuthenticated, navigate, user, accessToken, isTokenValid]);

  const handleSubmit = async (data: Partial<Password>) => {
    setError(null);
    setSubmitSuccess(false);

    try {
      // Check authentication status before proceeding
      if (!isAuthenticated || !accessToken) {
        const authError = "You must be logged in to add passwords";
        console.error(authError, { isAuthenticated, hasToken: !!accessToken });
        setError(authError + ". Please log in again.");
        navigate("/login");
        return;
      }

      // Explicitly ensure auth header is set
      if (ensureAuthHeader) {
        ensureAuthHeader();
      }

      // Validate token if we have the function
      if (isTokenValid && !isTokenValid()) {
        const tokenError = "Your session has expired";
        console.error(tokenError);
        setError(tokenError + ". Please log in again.");
        navigate("/login");
        return;
      }

      const now = new Date().toISOString();
      const passwordData: Password = {
        id: 0, // Will be assigned by server
        ...data,
        title: data.title || "Untitled",
        username: data.username || "",
        password: data.password || "",
        website: data.website || "",
        category: data.category || "Other",
        createdAt: now,
        updatedAt: now,
        userId: 0, // Will be set by the server
      };

      // Use React Query mutation to add the password
      await addPasswordMutation.mutateAsync(passwordData, {
        onSuccess: async () => {
          console.log("Password added successfully!");
          setSubmitSuccess(true);

          // Force fetch to update the cache with the latest data from server
          await fetchPasswords();

          // Also explicitly invalidate the passwords list query to ensure fresh data
          queryClient.invalidateQueries({
            queryKey: queryKeys.passwords.lists(),
          });

          // Small delay to show success message before redirecting
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        },
        onError: (err: any) => {
          console.error("Failed to add password:", err);
          setError(
            err?.message || "An unexpected error occurred. Please try again."
          );
        },
      });
    } catch (err: any) {
      console.error("Failed to add password:", err);
      setError(
        err?.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <ItemForm
      mode="add"
      onSubmit={handleSubmit}
      isLoading={addPasswordMutation.isPending}
      error={error}
      submitSuccess={submitSuccess}
      disableNonLoginTypes={true}
    />
  );
}
