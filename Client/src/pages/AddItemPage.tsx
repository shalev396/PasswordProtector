import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePasswords } from "@/hooks/usePasswords";
import { ItemForm } from "@/components/ItemForm";
import { Password } from "@/types";

export default function AddItemPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, accessToken, isTokenValid, ensureAuthHeader } =
    useAuth();
  const {
    addPassword,
    isLoading: passwordsLoading,
    error: passwordError,
  } = usePasswords();

  const [error, setError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      console.warn("User not authenticated, redirecting to login");
      navigate("/login");
    }
  }, [isAuthenticated, navigate, user, accessToken, isTokenValid]);

  // Update error from the hook
  useEffect(() => {
    if (passwordError) {
      setError(passwordError);
    }
  }, [passwordError]);

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
        createdAt: now,
        updatedAt: now,
        userId: 0, // Will be set by the server
      };

      await addPassword(passwordData);
      setSubmitSuccess(true);

      // Small delay to show success message before redirecting
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
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
      isLoading={passwordsLoading}
      error={error}
      submitSuccess={submitSuccess}
    />
  );
}
