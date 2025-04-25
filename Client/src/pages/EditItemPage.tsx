import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updatePassword } from "@/redux/slices/passwordSlice";
import apiClient from "@/api/api";
import { encryptPassword } from "@/lib/crypto";
import { Password } from "@/types";
import { ItemForm } from "@/components/ItemForm";

export default function EditItemPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, getMasterPassword } = useAuth();

  const passwords = useSelector(
    (state: RootState) => state.passwords.passwords
  );
  const isLoading = useSelector(
    (state: RootState) => state.passwords.isLoading
  );

  const [error, setError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [initialData, setInitialData] = useState<
    Partial<Password> | undefined
  >();
  const [initialLoading, setInitialLoading] = useState(true);

  // Check if user is authenticated and load item data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadPasswordData = async () => {
      try {
        let passwordItem: Password | undefined;

        if (passwords.length > 0) {
          passwordItem = passwords.find((item) => String(item.id) === id);
        }

        if (!passwordItem && id) {
          const response = await apiClient.get(`/passwords/${id}`);
          passwordItem = response.data;

          if (passwordItem) {
            // Store the encrypted password before decryption
            const encryptedPassword =
              passwordItem.encryptedPassword || passwordItem.password;

            // Decrypt password if needed
            const masterKey = getMasterPassword();
            if (masterKey && passwordItem.encryptedPassword) {
              const { decryptPassword } = await import("@/lib/crypto");
              try {
                const decryptedPassword = await decryptPassword(
                  passwordItem.encryptedPassword,
                  masterKey
                );
                // Store both encrypted and decrypted versions
                passwordItem.password = passwordItem.encryptedPassword;
                passwordItem.encryptedPassword = encryptedPassword;
              } catch (err) {
                console.error("Failed to decrypt password:", err);
                // If decryption fails, still use the encrypted password
                passwordItem.password = encryptedPassword;
              }
            } else {
              // If no encryption, ensure password is set correctly
              passwordItem.password = encryptedPassword;
            }
          }
        }

        if (passwordItem) {
          setInitialData(passwordItem);
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Failed to load password:", err);
        navigate("/dashboard");
      } finally {
        setInitialLoading(false);
      }
    };

    loadPasswordData();
  }, [id, isAuthenticated, navigate, passwords, getMasterPassword]);

  const handleSubmit = async (data: Partial<Password>) => {
    setError(null);
    setSubmitSuccess(false);

    try {
      if (!id) {
        throw new Error("Password ID is missing");
      }

      const masterKey = getMasterPassword();
      if (!masterKey) {
        throw new Error("Master key not found");
      }

      const encryptedPassword = await encryptPassword(
        data.password || "",
        masterKey
      );

      const response = await apiClient.put(`/passwords/${id}`, {
        ...data,
        encryptedPassword,
        password: undefined,
      });

      dispatch(
        updatePassword({
          ...response.data,
          password: data.password,
        })
      );

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err: any) {
      console.error("Failed to update password:", err);
      setError(
        err?.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-medium">Loading item data...</p>
      </div>
    );
  }

  return (
    <ItemForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      submitSuccess={submitSuccess}
    />
  );
}
