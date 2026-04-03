# Password Protector — MVP

## What It Is

A zero-knowledge password manager. The server never sees plaintext passwords — all encryption and decryption happens in the browser.

## How It Works

### Encryption

- **Algorithm**: AES-256-GCM (authenticated encryption)
- **Key derivation**: PBKDF2 with 100,000 iterations (SHA-256) from the user's master password + email as salt
- **Per-password salt**: Each stored password gets a unique random salt, prepended to the ciphertext
- **IV**: 12-byte random initialization vector generated per encryption, prepended to the ciphertext
- The derived master key lives only in `sessionStorage` (tab-scoped, cleared on tab close)

### Authentication

- **Provider**: AWS Cognito (managed user pool)
- **Flows**: Signup → email verification (confirm code) → login, forgot/reset password, token refresh
- **Tokens**: Cognito ID token (1h, sessionStorage) + refresh token (30d, localStorage)
- **Master password capture**: On login, the client derives the encryption key from the password _before_ sending it to Cognito. The server never handles the plaintext master password for encryption purposes.
- **New tab behavior**: Refresh token restores the Cognito session, but the master key is gone (sessionStorage is tab-scoped). The vault prompts the user to re-enter their master password before any decrypt operation.

### Password Vault (CRUD)

| Operation | Endpoint                    | Auth     | Notes                                      |
| --------- | --------------------------- | -------- | ------------------------------------------ |
| List all  | `GET /api/private/passwords`      | Required | Returns all passwords for the authenticated user |
| Get one   | `GET /api/private/passwords/:id`  | Required | Ownership verified server-side             |
| Create    | `POST /api/private/passwords`     | Required | Password field is already encrypted client-side |
| Update    | `PUT /api/private/passwords/:id`  | Required | Ownership verified; re-encrypted if changed |
| Delete    | `DELETE /api/private/passwords/:id` | Required | Ownership verified; hard delete            |

### Password Generator

- Cryptographically secure (`crypto.getRandomValues`)
- Configurable length: 8–32 characters
- Toggle character types: uppercase, lowercase, numbers, symbols
- Guarantees at least one character from each selected type
- 5-tier strength meter (Very Weak → Strong)

### Dashboard

- Search across title, username, and website
- Filter by category
- Sort by last updated, alphabetical, or category (ascending/descending)
- Reveal/copy individual passwords (decrypted on demand)
- Dark/light mode

## Database Schema

### Users

| Column     | Type         | Notes                    |
| ---------- | ------------ | ------------------------ |
| id         | UUID (PK)    | Auto-generated           |
| cognitoSub | VARCHAR      | Unique, from Cognito     |
| name       | VARCHAR      | Nullable                 |
| email      | VARCHAR      | From Cognito ID token    |
| lastLoginAt| TIMESTAMP    | Updated on each login    |
| createdAt  | TIMESTAMP    | Auto                     |
| updatedAt  | TIMESTAMP    | Auto                     |

### Passwords

| Column   | Type         | Notes                              |
| -------- | ------------ | ---------------------------------- |
| id       | UUID (PK)    | Auto-generated                     |
| userId   | UUID (FK)    | References Users.id, cascade delete |
| title    | VARCHAR(255) | Required                           |
| username | VARCHAR(255) | Nullable                           |
| password | TEXT         | Encrypted ciphertext (required)    |
| website  | VARCHAR(255) | Nullable                           |
| notes    | TEXT         | Nullable                           |
| category | VARCHAR(100) | Nullable                           |
| createdAt| TIMESTAMP    | Auto                               |
| updatedAt| TIMESTAMP    | Auto                               |

## Infrastructure

- **Runtime**: Node.js 22 on AWS Lambda (private VPC subnet with NAT Gateway)
- **Database**: PostgreSQL via Sequelize (SSL, 60s timeout, pool max 2)
- **API**: API Gateway (httpApi) → Lambda (Express via serverless-http)
- **Frontend**: React 19 + Vite → S3 + CloudFront CDN
- **Auth**: Cognito User Pool with SES custom domain email (DKIM-verified)
- **DNS**: Route 53 → CloudFront
- **CI/CD**: GitHub Actions (lint + build → deploy backend → deploy frontend)
- **i18n**: English + Hebrew (RTL support)
