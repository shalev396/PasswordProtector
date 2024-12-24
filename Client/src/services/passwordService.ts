import api from "@/api/api";
import { encryptPassword, decryptPassword } from "@/lib/crypto";
import { getMasterPassword } from "./authService";

// Define the password interface
export interface Password {
  id?: string;
  title: string;
  username?: string;
  password: string;
  url?: string;
  category?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Get all passwords for the authenticated user
 */
export const getPasswords = async (): Promise<Password[]> => {
  try {
    const response = await api.get("/passwords");
    const passwords = response.data;

    // Decrypt the passwords
    const masterPassword = getMasterPassword();
    if (!masterPassword) throw new Error("Master password not found");

    return passwords.map((encryptedPwd: any) => ({
      ...encryptedPwd,
      password: decryptPassword(encryptedPwd.encryptedPassword, masterPassword),
    }));
  } catch (error) {
    console.error("Error fetching passwords:", error);
    throw error;
  }
};

/**
 * Create a new password
 */
export const createPassword = async (password: Password): Promise<Password> => {
  try {
    // Encrypt the password before sending to server
    const masterPassword = getMasterPassword();
    if (!masterPassword) throw new Error("Master password not found");

    const encryptedPassword = encryptPassword(
      password.password,
      masterPassword
    );

    const response = await api.post("/passwords", {
      ...password,
      encryptedPassword,
      // Don't send the plaintext password to the server
      password: undefined,
    });

    return {
      ...response.data,
      password: password.password,
    };
  } catch (error) {
    console.error("Error creating password:", error);
    throw error;
  }
};

/**
 * Update an existing password
 */
export const updatePassword = async (password: Password): Promise<Password> => {
  try {
    if (!password.id) {
      throw new Error("Password ID is required for update");
    }

    // Encrypt the password before sending to server
    const masterPassword = getMasterPassword();
    if (!masterPassword) throw new Error("Master password not found");

    const encryptedPassword = encryptPassword(
      password.password,
      masterPassword
    );

    const response = await api.put(`/passwords/${password.id}`, {
      ...password,
      encryptedPassword,
      // Don't send the plaintext password to the server
      password: undefined,
    });

    return {
      ...response.data,
      password: password.password,
    };
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

/**
 * Delete a password
 */
export const deletePassword = async (id: string): Promise<void> => {
  try {
    await api.delete(`/passwords/${id}`);
  } catch (error) {
    console.error("Error deleting password:", error);
    throw error;
  }
};

export default {
  getPasswords,
  createPassword,
  updatePassword,
  deletePassword,
};
