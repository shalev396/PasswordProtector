# Password Protector - Encryption Documentation

This document explains the encryption flow in the Password Protector application, focusing on how passwords are securely encrypted, stored, and decrypted. Understanding this flow is essential for maintaining the security of the application.

## Password Encryption Flow

### Overview

In Password Protector, sensitive data is encrypted using a strong encryption model:

1. All password encryption/decryption happens on the client-side
2. Only encrypted data is transmitted to the server
3. The server never has access to unencrypted passwords
4. Encryption keys are derived from the user's master password and never stored directly

### Key Concepts

- **Master Password**: The user's login password serves as the foundation for all encryption
- **Derived Key**: A key derived from the master password used for encryption/decryption
- **Salt**: Random data used to ensure the same password generates different encrypted results
- **AES-GCM**: The Advanced Encryption Standard with Galois/Counter Mode, a secure encryption algorithm

## Key Management

Encryption keys are derived from the user's master password and a unique salt for each password. The master password is never stored directly, and the derived keys are not stored persistently. Instead, they are generated on-the-fly when needed for encryption or decryption. This ensures that even if the application's memory is compromised, the encryption keys cannot be extracted.

### Key Storage Strategy

#### Master Password

1. **Temporary Storage**: The master password (user's login password) is only stored in memory during the active session
2. **Redux Store**: Stored in the Redux user state as `masterKey`
3. **No Persistence**: Never written to disk or localStorage
4. **Lifecycle**: Cleared when the user logs out or the session expires

```javascript
// Example of how the master key is stored in Redux (from userSlice.ts)
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setMasterKey: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.masterKey = action.payload;
      }
    },
    clearUser: (state) => {
      state.user = null; // This clears the master key as well
    },
  },
});
```

#### Derived Encryption Keys

1. **Generated On-Demand**: Derived from the master password + salt when needed
2. **Web Crypto API**: Uses PBKDF2 (Password-Based Key Derivation Function 2) for key derivation
3. **No Persistence**: Only exists in memory during the encryption/decryption operation
4. **Automatic Garbage Collection**: JavaScript engine cleans up after use

```javascript
// Example of key derivation using Web Crypto API
async function generateEncryptionKey(password, salt) {
  // Convert password and salt to appropriate format
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);

  // Import the password as a key for derivation
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  // Derive a key for AES-GCM
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000, // High iteration count for security
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false, // Not extractable
    ["encrypt", "decrypt"]
  );
}
```

#### Salt Storage

1. **Unique Per Password**: Each password has its own random salt
2. **Stored with Encrypted Data**: Salt is prepended to the encrypted data
3. **Format**: `saltHex:encryptedDataBase64`
4. **Database Storage**: Stored along with the encrypted password

### Key Rotation

- **No Automatic Key Rotation**: The master key doesn't rotate automatically
- **Password Change**: When a user changes their master password, all passwords need to be re-encrypted
- **Implementation**: Not yet implemented in the current version

## Add Password Flow

When a user adds a new password through the Add Password page, the following encryption flow occurs:

### 1. Client-Side: Input Capture

- User enters password details (title, username, password, etc.)
- The plaintext password exists only in memory at this point

### 2. Client-Side: Encryption Preparation

- The application retrieves the user's master key (derived from their login password)
- A random salt is generated for this specific password encryption
- The encryption key is derived from the master password and salt using PBKDF2

### 3. Client-Side: Password Encryption

```javascript
// Sample encryption process (simplified from actual implementation)
async function encryptPassword(password, masterPassword) {
  // Generate a random salt
  const saltBuffer = window.crypto.getRandomValues(new Uint8Array(16));
  const salt = Array.from(saltBuffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Generate encryption key from master password and salt
  const encryptionKey = await generateEncryptionKey(masterPassword, salt);

  // Encrypt the password using AES-GCM
  const encryptedData = await encryptData(password, encryptionKey);

  // Return combined salt and encrypted data
  return `${salt}:${encryptedData}`;
}
```

### 4. Client-Side: API Preparation

- The original plaintext password is removed from the data to be sent
- The encrypted password is added to the data as `password`
- The API call is prepared with proper authentication headers

### 5. Server-Side: Data Reception

- The server receives the password data with the encrypted password
- The server does NOT have the key to decrypt the password
- The server validates the request authentication and format

### 6. Server-Side: Database Storage

- The encrypted password is stored directly in the database
- The passwords table contains encrypted passwords, never plaintext
- The encryption salt is stored as part of the encrypted password string

### 7. Database: Encrypted Storage

```sql
-- Example database schema (simplified)
CREATE TABLE Passwords (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    password TEXT NOT NULL, -- Stores encrypted password
    website VARCHAR(255),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);
```

## Decryption Flow

When a user views or edits a password:

1. Encrypted password is retrieved from the server
2. The client extracts the salt from the encrypted string
3. The master key is used with the salt to recreate the encryption key
4. The password is decrypted on the client side only
5. The plaintext password is displayed to the user

## Complete Example

### Adding a New Password

1. User inputs:

   - Title: "GitHub Account"
   - Username: "johndoe"
   - Password: "MySecretPass123!"
   - Website: "github.com"
   - Category: "Development"

2. Client-side encryption:

   - Master password: "MasterPass456!"
   - Generated salt: "8f7d6a3e2b1c9f8e7d6a"
   - Derived encryption key (from master password and salt)
   - Encrypted password result: "8f7d6a3e2b1c9f8e7d6a:AES-GCM-Encrypted-Data-Base64-Encoded..."

3. Data sent to server:

```json
{
  "title": "GitHub Account",
  "username": "johndoe",
  "password": "8f7d6a3e2b1c9f8e7d6a:AES-GCM-Encrypted-Data-Base64-Encoded...",
  "website": "github.com",
  "category": "Development"
}
```

4. Server stores the encrypted data in the database without ever seeing the actual password

### Viewing the Password Later

1. User requests to view the password
2. Server returns the encrypted password: "8f7d6a3e2b1c9f8e7d6a:AES-GCM-Encrypted-Data-Base64-Encoded..."
3. Client extracts salt: "8f7d6a3e2b1c9f8e7d6a"
4. Client recreates encryption key using master password and salt
5. Client decrypts password to reveal: "MySecretPass123!"

## Environment Variables

The encryption system relies on the following environment configurations:

### Client Environment

- No encryption-specific environment variables
- All encryption is performed using the Web Crypto API
- Master password is temporarily stored in memory during the session

### Server Environment

- `JWT_SECRET`: Used for authentication tokens, not directly for password encryption
- No access to encryption/decryption keys

## Security Considerations

- The master password is never stored anywhere - if lost, encrypted data cannot be recovered
- All encryption and decryption happens in the browser
- The server and database only ever see encrypted data
- Encryption uses industry-standard AES-GCM algorithm
- Each password has its own unique salt to prevent pattern matching

By following this architecture, Password Protector ensures that sensitive password data remains encrypted throughout the entire application lifecycle, and only the end user with the correct master password can access the plaintext values.
