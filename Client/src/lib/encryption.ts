/**
 * Encryption and decryption utilities for secure password storage
 */

/**
 * Encrypts sensitive data using the provided master key
 * @param data The string data to encrypt
 * @param masterKey The user's master key for encryption
 * @returns The encrypted data as a string
 */
export async function encrypt(
  data: string,
  masterKey: string
): Promise<string> {
  try {
    // Convert string data to Uint8Array
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);

    // Generate a random initialization vector (IV)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Import the master key for encryption
    const key = await importMasterKey(masterKey);

    // Encrypt the data
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      dataBytes
    );

    // Combine IV and encrypted data
    const encryptedArray = new Uint8Array(
      iv.length + encryptedBuffer.byteLength
    );
    encryptedArray.set(iv);
    encryptedArray.set(new Uint8Array(encryptedBuffer), iv.length);

    // Convert to base64 for storage
    return arrayBufferToBase64(encryptedArray.buffer);
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt data");
  }
}

/**
 * Decrypts previously encrypted data using the provided master key
 * @param encryptedData The encrypted data string (base64)
 * @param masterKey The user's master key for decryption
 * @returns The decrypted data as a string
 */
export async function decrypt(
  encryptedData: string,
  masterKey: string
): Promise<string> {
  try {
    // Convert base64 string to Uint8Array
    const encryptedBytes = base64ToArrayBuffer(encryptedData);

    // Extract the IV (first 12 bytes)
    const iv = encryptedBytes.slice(0, 12);

    // Extract the encrypted data (remaining bytes)
    const data = encryptedBytes.slice(12);

    // Import the master key for decryption
    const key = await importMasterKey(masterKey);

    // Decrypt the data
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      data
    );

    // Convert the decrypted data back to a string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data");
  }
}

/**
 * Convert an ArrayBuffer to a Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert a Base64 string to an ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Import a master key string into a CryptoKey for use with the Web Crypto API
 */
async function importMasterKey(masterKey: string): Promise<CryptoKey> {
  // Generate a consistent key from the master password using SHA-256
  const encoder = new TextEncoder();
  const masterKeyData = encoder.encode(masterKey);

  // Hash the master key to get a consistent length key
  const hashedKeyBuffer = await crypto.subtle.digest("SHA-256", masterKeyData);

  // Import the hashed key as an AES-GCM key
  return crypto.subtle.importKey(
    "raw",
    hashedKeyBuffer,
    {
      name: "AES-GCM",
      length: 256,
    },
    false, // Not extractable
    ["encrypt", "decrypt"]
  );
}
