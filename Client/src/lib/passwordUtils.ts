// Client-side password generation utilities

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

/**
 * Generates a random password based on specified criteria using
 * cryptographically secure random values.
 */
export function generatePassword(options: PasswordOptions): string {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_-+=<>?"; // Consider adding more symbols if needed

  let availableChars = "";
  let requiredChars: string[] = [];

  if (options.uppercase) {
    availableChars += uppercaseChars;
    requiredChars.push(
      uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]
    );
  }
  if (options.lowercase) {
    availableChars += lowercaseChars;
    requiredChars.push(
      lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]
    );
  }
  if (options.numbers) {
    availableChars += numberChars;
    requiredChars.push(
      numberChars[Math.floor(Math.random() * numberChars.length)]
    );
  }
  if (options.symbols) {
    availableChars += symbolChars;
    requiredChars.push(
      symbolChars[Math.floor(Math.random() * symbolChars.length)]
    );
  }

  // Fallback if no character types are selected (should ideally be prevented by UI)
  if (!availableChars) {
    availableChars = lowercaseChars;
    requiredChars.push(
      lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]
    );
  }

  // Ensure length is sufficient for required characters
  const finalLength = Math.max(options.length, requiredChars.length);

  let password = "";
  const randomValues = new Uint32Array(finalLength);
  window.crypto.getRandomValues(randomValues); // Generate secure random numbers

  // Generate the remaining part of the password
  for (let i = 0; i < finalLength - requiredChars.length; i++) {
    const randomIndex = randomValues[i] % availableChars.length;
    password += availableChars[randomIndex];
  }

  // Combine required characters with the generated part
  let combinedChars = requiredChars.concat(password.split(""));

  // Shuffle the combined characters using Fisher-Yates algorithm
  for (let i = combinedChars.length - 1; i > 0; i--) {
    const j = randomValues[finalLength - 1 - i] % (i + 1); // Use remaining random values for shuffle
    [combinedChars[i], combinedChars[j]] = [combinedChars[j], combinedChars[i]];
  }

  return combinedChars.join("");
}
