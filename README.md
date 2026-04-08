# Password Protector

[![Live Site](https://img.shields.io/badge/Live%20Site-password--protector.shalev396.com-blue?style=for-the-badge)](https://password-protector.shalev396.com/)

A zero-knowledge password manager where the server never sees your plaintext passwords. All encryption and decryption happens client-side using AES-256-GCM.

---

## How It Works

1. **You set a master password** during login
2. **An encryption key is derived** from your master password + email using PBKDF2 (100k iterations, SHA-256)
3. **Passwords are encrypted in-browser** before being sent to the server
4. **The server stores only ciphertext** — it can never read your passwords
5. **Decryption happens in-browser** when you need to view a password

The master key lives only in memory (Redux store with 15-minute TTL). It is never persisted to any storage.

---

## Tech Stack

**Frontend** — React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, Redux Toolkit, React Query, i18n (English + Hebrew)

**Backend** — Node.js 22, Express (serverless-http), Sequelize + PostgreSQL, AWS Cognito auth

**Infrastructure** — AWS Lambda (private VPC), API Gateway, S3, CloudFront, Route 53, Cognito, SES

**CI/CD** — GitHub Actions (push to `dev` deploys to dev, push to `main` deploys to prod)

---

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL database
- AWS account (for Cognito, Lambda, S3, CloudFront)

### Run Locally

**Backend** (port 3000):

```bash
cd server
npm install
npm run dev
```

**Frontend** (port 5173):

```bash
cd client
npm install
npm run dev
```

### Environment Variables

Copy `server/.env.example` to `server/.env.dev` and fill in the required values. See the example file for all variables.

---

## Project Structure

```
client/          React frontend (Vite, Tailwind, shadcn/ui, Redux)
server/          Serverless backend (Express, Sequelize, Cognito)
postman/         Postman API test collections and environments
.github/         CI/CD workflows
```

---

## API Documentation

Full OpenAPI 3.0 spec: [`server/openapi.yaml`](server/openapi.yaml). Use it with [Swagger Editor](https://editor.swagger.io), Postman, or any OpenAPI-compatible tool.

### Endpoints Overview

**Public** — Authentication (no token required):

| Method | Endpoint                               | Description                 |
| ------ | -------------------------------------- | --------------------------- |
| POST   | `/api/public/auth/signup`              | Register a new user         |
| POST   | `/api/public/auth/confirm`             | Confirm email verification  |
| POST   | `/api/public/auth/resend-confirmation` | Resend verification code    |
| POST   | `/api/public/auth/login`               | Authenticate and get tokens |
| POST   | `/api/public/auth/forgot-password`     | Request password reset code |
| POST   | `/api/public/auth/reset-password`      | Reset password with code    |
| POST   | `/api/public/auth/refresh`             | Refresh expired ID token    |

**Private** — Passwords (Bearer token required):

| Method | Endpoint                     | Description                                 |
| ------ | ---------------------------- | ------------------------------------------- |
| GET    | `/api/private/passwords`     | List all passwords (without password field) |
| POST   | `/api/private/passwords`     | Create a new password entry                 |
| GET    | `/api/private/passwords/:id` | Get full password entry (with password)     |
| PUT    | `/api/private/passwords/:id` | Update a password entry                     |
| DELETE | `/api/private/passwords/:id` | Delete a password entry                     |

**Private** — User (Bearer token required):

| Method | Endpoint                 | Description             |
| ------ | ------------------------ | ----------------------- |
| GET    | `/api/private/me`        | Get user profile        |
| PUT    | `/api/private/me`        | Update user profile     |
| GET    | `/api/private/me/export` | Export user data as ZIP |
| DELETE | `/api/private/delete`    | Delete user account     |

**Dev** — Development tools:

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| POST   | `/api/dev/sync-db` | Sync database schema       |
| POST   | `/api/dev/reset`   | Reset database and Cognito |

---

## Tests

| Suite                                        | Description                                                            |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| [Backend API tests](postman/README.md)       | 97 Postman requests (auth, user, passwords, flows)                     |
| [Frontend E2E tests](client/tests/README.md) | Playwright + Python (smoke, a11y, visual, responsive, security, flows) |

---

## Encryption Details

- **Algorithm**: AES-256-GCM (authenticated encryption)
- **Key derivation**: PBKDF2 with 100,000 iterations (SHA-256), master password + email as salt
- **Per-password salt**: Unique random salt prepended to each ciphertext
- **IV**: 12-byte random initialization vector per encryption

---

## Database Schema

### Users

| Column      | Type      | Notes                 |
| ----------- | --------- | --------------------- |
| id          | UUID (PK) | Auto-generated        |
| cognitoSub  | VARCHAR   | Unique, from Cognito  |
| name        | VARCHAR   | Nullable              |
| email       | VARCHAR   | From Cognito ID token |
| lastLoginAt | TIMESTAMP | Updated on each login |

### Passwords

| Column   | Type         | Notes                               |
| -------- | ------------ | ----------------------------------- |
| id       | UUID (PK)    | Auto-generated                      |
| userId   | UUID (FK)    | References Users.id, cascade delete |
| title    | VARCHAR(255) | Required                            |
| username | VARCHAR(255) | Nullable                            |
| password | TEXT         | Encrypted ciphertext (required)     |
| website  | VARCHAR(255) | Nullable                            |
| notes    | TEXT         | Nullable                            |
| category | VARCHAR(100) | Nullable                            |
| tags     | ARRAY        | String array                        |

---

## Build & Validate

```bash
npm run verify    # builds + lints client and server, runs prettier
```

---

## Deployment

Push to `dev` or `main` triggers automatic deployment via GitHub Actions. Manual deploy:

```bash
cd server
npm run deploy:dev    # or deploy:prod
```

---

## Built On

[Elytra](https://github.com/shalev396/Elytra) — Full-stack serverless AWS template

---

## License

MIT
