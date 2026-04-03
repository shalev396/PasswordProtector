import crypto from 'node:crypto';
import { environment } from '../config/environment.js';

const PBKDF2_ITERATIONS = 100_000;
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const DIGEST = 'sha256';

/**
 * Generates a cryptographically secure random seed for a user.
 * Called once when the user first signs up / logs in.
 * Stored as hex in the Users table.
 */
export function generateUserSeed(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}

/**
 * Derives a 256-bit AES key from the user's encryption seed
 * combined with the SERVER_ENCRYPTION_SECRET environment variable.
 *
 * This ensures that even if the database is dumped, the attacker
 * cannot derive the server key without the env var.
 */
function deriveServerKey(userSeed: string): Buffer {
  return crypto.pbkdf2Sync(
    userSeed,
    environment.serverEncryptionSecret,
    PBKDF2_ITERATIONS,
    KEY_LENGTH,
    DIGEST,
  );
}

/**
 * Server-side encryption (layer 2).
 *
 * Takes the client-encrypted ciphertext (layer 1) and encrypts it again
 * using the user's seed + server secret.
 *
 * Output format: base64(iv[12] + authTag[16] + ciphertext[...])
 */
export function serverEncrypt(plaintext: string, userSeed: string): string {
  const key = deriveServerKey(userSeed);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

/**
 * Server-side decryption (removes layer 2).
 *
 * Takes the doubly-encrypted value from the database, decrypts the server
 * layer, and returns the client-encrypted ciphertext (layer 1).
 *
 * Expected input format: base64(iv[12] + authTag[16] + ciphertext[...])
 */
export function serverDecrypt(encryptedStr: string, userSeed: string): string {
  const key = deriveServerKey(userSeed);
  const data = Buffer.from(encryptedStr, 'base64');

  if (data.length < IV_LENGTH + AUTH_TAG_LENGTH) {
    throw new Error('Invalid encrypted data: too short');
  }

  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}
