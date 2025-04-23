/**
 * Generates a cryptographically secure random password
 * @param length The length of the password to generate
 * @param options Configuration options for password generation
 * @returns A secure random password string
 */
export function generateRandomPassword(
  length = 16,
  options = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  }
): string {
  // Define character sets based on options
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_-+=[]{}|:;<>,.?/~";

  // Initialize the character pool
  let charPool = "";

  // Add selected character types to the pool
  if (options.uppercase) charPool += uppercaseChars;
  if (options.lowercase) charPool += lowercaseChars;
  if (options.numbers) charPool += numberChars;
  if (options.symbols) charPool += symbolChars;

  // Ensure at least some character set is selected
  if (!charPool) {
    charPool = lowercaseChars + numberChars;
  }

  // Generate random bytes using the Web Crypto API
  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);

  // Build the password using the random bytes
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = randomValues[i] % charPool.length;
    password += charPool.charAt(randomIndex);
  }

  // Ensure the password includes at least one character from each selected type
  const requiredChars = [];
  if (options.uppercase) requiredChars.push(getRandomChar(uppercaseChars));
  if (options.lowercase) requiredChars.push(getRandomChar(lowercaseChars));
  if (options.numbers) requiredChars.push(getRandomChar(numberChars));
  if (options.symbols) requiredChars.push(getRandomChar(symbolChars));

  if (requiredChars.length > 0) {
    // Replace the first few characters with the required chars
    password = replaceRandomChars(password, requiredChars);
  }

  return password;
}

/**
 * Get a random character from a string
 */
function getRandomChar(charSet: string): string {
  const randomIndex =
    window.crypto.getRandomValues(new Uint32Array(1))[0] % charSet.length;
  return charSet.charAt(randomIndex);
}

/**
 * Replace random positions in a string with required characters
 */
function replaceRandomChars(str: string, chars: string[]): string {
  const result = str.split("");
  const positions: number[] = [];

  // Generate random unique positions
  while (positions.length < chars.length) {
    const pos =
      window.crypto.getRandomValues(new Uint32Array(1))[0] % str.length;
    if (!positions.includes(pos)) {
      positions.push(pos);
    }
  }

  // Replace characters at those positions
  for (let i = 0; i < chars.length; i++) {
    result[positions[i]] = chars[i];
  }

  return result.join("");
}

/**
 * Calculates the estimated strength of a password
 * @param password The password to evaluate
 * @returns A score from 0 (weak) to 5 (strong)
 */
export function calculatePasswordStrength(password: string): number {
  if (!password) return 0;

  let score = 0;

  // Check length
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Check character variety
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  return Math.min(score, 5);
}
