// Client-side crypto utility functions

/**
 * Generates a secure encryption key from the master password and salt (email)
 * using PBKDF2 and AES-GCM.
 */
export async function generateEncryptionKey(
  password: string,
  salt: string
): Promise<CryptoKey> {
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
}

/**
 * Hashes the master password using SHA-256 for authentication verification.
 * Includes the salt (email) in the hash input.
 */
export async function hashPassword(
  password: string,
  salt: string
): Promise<string> {
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
  return btoa(String.fromCharCode.apply(null, Array.from(resultBuffer)));
}

/**
 * Decrypts a base64 encoded string (containing IV + ciphertext)
 * using AES-GCM with the provided encryption key.
 */
export async function decryptData(
  encryptedDataB64: string,
  encryptionKey: CryptoKey
): Promise<string> {
  // Decode base64 string back to Uint8Array
  const encryptedBytes = Uint8Array.from(atob(encryptedDataB64), (c) =>
    c.charCodeAt(0)
  );

  // Extract the IV (first 12 bytes)
  const iv = encryptedBytes.slice(0, 12);
  // Extract the actual ciphertext
  const ciphertext = encryptedBytes.slice(12);

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
  return decoder.decode(decryptedBuffer);
}
