interface GeneratorOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_-+=[]{}|:;<>,.?/~',
} as const;

export function generatePassword(options: GeneratorOptions): string {
  const { length, uppercase, lowercase, numbers, symbols } = options;

  let charset = '';
  const required: string[] = [];

  if (uppercase) {
    charset += CHAR_SETS.uppercase;
    required.push(randomChar(CHAR_SETS.uppercase));
  }
  if (lowercase) {
    charset += CHAR_SETS.lowercase;
    required.push(randomChar(CHAR_SETS.lowercase));
  }
  if (numbers) {
    charset += CHAR_SETS.numbers;
    required.push(randomChar(CHAR_SETS.numbers));
  }
  if (symbols) {
    charset += CHAR_SETS.symbols;
    required.push(randomChar(CHAR_SETS.symbols));
  }

  if (charset === '') {
    return '';
  }

  const remaining = length - required.length;
  const chars = [...required];

  for (let i = 0; i < remaining; i++) {
    chars.push(randomChar(charset));
  }

  // Shuffle using Fisher-Yates
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    const temp = chars[i] ?? '';
    chars[i] = chars[j] ?? '';
    chars[j] = temp;
  }

  return chars.join('');
}

function randomChar(charset: string): string {
  const index = secureRandomInt(charset.length);
  return charset.charAt(index);
}

function secureRandomInt(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const value = array[0] ?? 0;
  return value % max;
}

export function calculateStrength(password: string): number {
  if (password.length === 0) {
    return 0;
  }

  let score = 0;
  if (password.length >= 8) {
    score++;
  }
  if (password.length >= 12) {
    score++;
  }
  if (password.length >= 16) {
    score++;
  }
  if (/[A-Z]/.test(password)) {
    score++;
  }
  if (/[a-z]/.test(password)) {
    score++;
  }
  if (/[0-9]/.test(password)) {
    score++;
  }
  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  }

  return Math.min(Math.floor((score / 7) * 4), 4);
}

export type { GeneratorOptions };
