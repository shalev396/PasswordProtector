// Client-side crypto utility functions

/**
 * Generates a secure encryption key from the master password and salt (email)
 * using PBKDF2 and AES-GCM.
 */
export async function generateEncryptionKey(
  password: string,
  salt: string
): Promise<CryptoKey> {
  try {
    if (!password || password.trim() === "") {
      throw new Error("Empty password provided for key generation");
    }

    if (!salt || salt.trim() === "") {
      throw new Error("Empty salt provided for key generation");
    }

    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const saltBuffer = encoder.encode(salt);

    // Import the password as a base key for PBKDF2
    const baseKey = await window.crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    // Derive the actual encryption key using PBKDF2
    const encryptionKey = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: saltBuffer,
        iterations: 100000, // Standard recommendation
        hash: "SHA-256",
      },
      baseKey,
      { name: "AES-GCM", length: 256 }, // AES-GCM is recommended for authenticated encryption
      true, // Extractable
      ["encrypt", "decrypt"] // Key usages
    );

    return encryptionKey;
  } catch (error) {
    console.error("Error generating encryption key:", error);
    throw new Error(
      `Key generation failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Hashes the master password using SHA-256 for authentication verification.
 * Includes the salt (email) in the hash input.
 */
export async function hashPassword(
  password: string,
  salt: string
): Promise<string> {
  try {
    if (!password || password.trim() === "") {
      throw new Error("Empty password provided for hashing");
    }

    if (!salt || salt.trim() === "") {
      throw new Error("Empty salt provided for hashing");
    }

    const encoder = new TextEncoder();
    // Combine password and salt before hashing
    const data = encoder.encode(password + salt);

    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    // Convert ArrayBuffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error(
      `Password hashing failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Encrypts data using AES-GCM with the provided encryption key.
 * Prepends a random 12-byte IV to the ciphertext.
 * Returns the result as a base64 string.
 */
export async function encryptData(
  data: string,
  encryptionKey: CryptoKey
): Promise<string> {
  try {
    if (!data) {
      throw new Error("Empty data provided for encryption");
    }

    if (!encryptionKey) {
      throw new Error("No encryption key provided");
    }

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    // Generate a random 12-byte IV (recommended size for AES-GCM)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      encryptionKey,
      dataBuffer
    );

    // Combine IV and encrypted data (IV first)
    const resultBuffer = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    resultBuffer.set(iv);
    resultBuffer.set(new Uint8Array(encryptedBuffer), iv.length);

    // Convert the combined buffer to a base64 string for easier storage
    const base64Result = btoa(
      String.fromCharCode.apply(null, Array.from(resultBuffer))
    );

    return base64Result;
  } catch (error) {
    console.error("Error encrypting data:", error);
    throw new Error(
      `Encryption failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Decrypts a base64 encoded string (containing IV + ciphertext)
 * using AES-GCM with the provided encryption key.
 */
export async function decryptData(
  encryptedDataB64: string,
  encryptionKey: CryptoKey
): Promise<string> {
  try {
    if (!encryptedDataB64) {
      throw new Error("Empty data provided for decryption");
    }

    if (!encryptionKey) {
      throw new Error("No encryption key provided for decryption");
    }

    // Decode base64 string back to Uint8Array
    let encryptedBytes;
    try {
      encryptedBytes = Uint8Array.from(atob(encryptedDataB64), (c) =>
        c.charCodeAt(0)
      );
    } catch (e) {
      throw new Error(
        `Invalid base64 encoding: ${
          e instanceof Error ? e.message : "Unknown error"
        }`
      );
    }

    // Check if data is long enough to contain IV and ciphertext
    if (encryptedBytes.length <= 12) {
      throw new Error(
        "Encrypted data is too short to contain IV and ciphertext"
      );
    }

    // Extract the IV (first 12 bytes)
    const iv = encryptedBytes.slice(0, 12);
    // Extract the actual ciphertext
    const ciphertext = encryptedBytes.slice(12);

    try {
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        encryptionKey,
        ciphertext
      );

      // Convert the decrypted ArrayBuffer back to a string
      const decoder = new TextDecoder();
      const result = decoder.decode(decryptedBuffer);

      return result;
    } catch (cryptoError) {
      console.error("Decryption operation failed:", cryptoError);
      throw new Error(
        "Failed to decrypt data. The password may be incorrect or data corrupted."
      );
    }
  } catch (error) {
    console.error("Error in decryptData:", error);
    throw new Error(
      `Decryption failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Encrypts a password using the master password
 */
export async function encryptPassword(
  password: string,
  masterPassword: string
): Promise<string> {
  try {
    // Validate inputs
    if (!password || password.trim() === "") {
      console.error("Empty password provided for encryption");
      throw new Error("Cannot encrypt empty password");
    }

    if (!masterPassword || masterPassword.trim() === "") {
      console.error("Empty master key provided for encryption");
      throw new Error("Master key is required for encryption");
    }

    // Generate a random salt for this encryption
    const saltBuffer = window.crypto.getRandomValues(new Uint8Array(16));
    const salt = Array.from(saltBuffer)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    try {
      // Generate encryption key from master password
      const encryptionKey = await generateEncryptionKey(masterPassword, salt);

      // Encrypt the password
      const encryptedData = await encryptData(password, encryptionKey);

      // Combine salt and encrypted data for storage
      const result = `${salt}:${encryptedData}`;

      return result;
    } catch (cryptoError) {
      console.error("Web Crypto API operation failed:", cryptoError);
      throw new Error(
        `Encryption failed: ${
          cryptoError instanceof Error
            ? cryptoError.message
            : "Unknown crypto error"
        }`
      );
    }
  } catch (error) {
    console.error("Password encryption failed:", error);
    throw error;
  }
}

/**
 * Decrypts a password using the master password
 */
export async function decryptPassword(
  encryptedPassword: string,
  masterPassword: string
): Promise<string> {
  try {
    // Validate inputs
    if (!encryptedPassword || encryptedPassword.trim() === "") {
      console.error("Empty encrypted password provided for decryption");
      throw new Error("Cannot decrypt empty data");
    }

    if (!masterPassword || masterPassword.trim() === "") {
      console.error("Empty master key provided for decryption");
      throw new Error("Master key is required for decryption");
    }

    // Split the salt and encrypted data
    const parts = encryptedPassword.split(":");
    if (parts.length !== 2) {
      console.error(
        "Invalid encrypted password format (incorrect number of parts):",
        {
          encryptedPasswordLength: encryptedPassword.length,
          parts: parts.length,
        }
      );
      throw new Error("Invalid encrypted password format");
    }

    const [salt, encryptedData] = parts;

    if (!salt || !encryptedData) {
      console.error(
        "Invalid encrypted password format (missing salt or data):",
        {
          hasSalt: !!salt,
          hasEncryptedData: !!encryptedData,
        }
      );
      throw new Error("Invalid encrypted password format");
    }

    try {
      // Generate encryption key from master password and salt
      const encryptionKey = await generateEncryptionKey(masterPassword, salt);

      // Decrypt the password
      const decryptedPassword = await decryptData(encryptedData, encryptionKey);

      return decryptedPassword;
    } catch (cryptoError) {
      console.error("Decryption operation failed:", cryptoError);

      // Provide a more specific error message for authentication issues
      if (
        cryptoError instanceof Error &&
        cryptoError.message.includes("operation failed")
      ) {
        throw new Error(
          "Failed to decrypt password. The master password may be incorrect."
        );
      }

      throw new Error(
        `Decryption failed: ${
          cryptoError instanceof Error
            ? cryptoError.message
            : "Unknown crypto error"
        }`
      );
    }
  } catch (error) {
    console.error("Password decryption failed:", error);
    throw error;
  }
}
