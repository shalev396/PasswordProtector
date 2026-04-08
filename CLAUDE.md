# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Password Protector is a zero-knowledge password manager with client-side AES-256-GCM encryption. Built on the Elytra template with WoltFlow VPC database connectivity.

## Repository Structure

- `client/` — React 19 + TypeScript frontend (Vite 7, Tailwind CSS 4, shadcn/ui, Redux Toolkit, i18n en+he)
- `server/` — Serverless backend with Express via serverless-http (Sequelize + PostgreSQL, Cognito auth)
- `.github/` — CI/CD workflows (reusable: \_deploy.yml, \_lint-build.yml)

## Build & Dev Commands

### Root

```bash
npm install              # husky + prettier
npm run format           # prettier write
```

> **Important**: Always use `npm run verify` from the repo root to validate changes. This single command builds and lints both client and server, then runs prettier. Prefer this over running individual build/lint commands.

### Server (`server/`)

```bash
npm install
npm run dev              # serverless offline + esbuild hot-reload (port 3000)
npm run build            # tsc --noEmit && webpack
npm run lint             # eslint (strict, zero warnings)
npm run deploy:dev       # build + serverless deploy --stage dev
npm run deploy:prod      # build + serverless deploy --stage prod
```

### Client (`client/`)

```bash
npm install
npm run dev              # vite dev server
npm run build            # tsc -b && vite build
npm run lint             # eslint (strict, zero warnings)
```

### Pre-commit Hook

Husky runs on every commit: `prettier format`, then if client/ changed: `build + lint client`, if server/ changed: `build + lint server`.

## Architecture

### Backend (Elytra template pattern)

- **3 Express apps** via serverless-http: `public-handler` (no auth), `private-handler` (Cognito JWT), `dev-handler` (dev tools)
- **Layer structure**: Handlers → Routes → Controllers → Classes → Models (repository pattern)
- **Auth**: AWS Cognito (signup, confirm, login, forgot/reset password, refresh). JWT verified via jwks-rsa.
- **Database**: PostgreSQL via Sequelize in private VPC. Connection: SSL, pool max 2, 60s timeout. Lambda has VPC ENI permissions.
- **Models**: `User` (cognitoSub, name, email, encryptionSeed) and `Password` (userId, title, username, encrypted password, website, notes, category, tags). Both UUID primary keys. List endpoint excludes password field; single-fetch includes it.
- **Middleware**: `expressAuth` (Cognito JWT verification), `responseFormatter` (res.success/res.error), `rateLimit`
- **Dual DB provider**: Template supports both Sequelize and Mongoose via DATABASE_PROVIDER. Only Sequelize models are maintained for this project.

### Frontend (Elytra template pattern)

- **Routing**: React Router v7 with i18n LanguageLayout (`/:lng/...`). English + Hebrew.
- **State**: Redux Toolkit with two slices: `userSlice` (auth, profile) and `masterPasswordSlice` (master password with 15-min TTL). idToken in sessionStorage, refreshToken in localStorage, masterPassword in Redux memory only (never persisted to any storage).
- **API**: Axios with auto-refresh interceptor on 401. Services in `api/services/`, React Query hooks in `api/queries/`.
- **Encryption**: Client-side AES-256-GCM. Key derived via PBKDF2 (100k iterations, SHA-256) from master password + email. Server never sees plaintext.
- **Types**: Client imports server types via `@api-types` Vite alias → `../server/src/types`.

### API Endpoints

- Public: `POST /api/public/auth/{signup,confirm,login,forgot-password,reset-password,refresh,resend-confirmation}`
- Private: `GET|POST /api/private/passwords`, `GET|PUT|DELETE /api/private/passwords/:id`, `GET /api/private/me`, `DELETE /api/private/delete`
- Dev: `POST /api/dev/{sync-db,reset}`

## Deployment

AWS infrastructure in `server/serverless.yml`: S3 (client hosting), CloudFront (CDN + API routing), Route 53 (DNS), Cognito (auth), SES (DKIM for Cognito email). Lambda functions run in private VPC subnet with NAT Gateway. CI/CD via GitHub Actions: push to dev deploys to dev, push to main deploys to prod.

## Environment Variables

See `server/.env.example`. Key additions beyond Elytra template: `LAMBDA_SECURITY_GROUP_ID`, `LAMBDA_SUBNET_ID` (VPC connectivity).

## ESLint Rules (Strict)

Both client and server use `strictTypeChecked` + `stylisticTypeChecked`. Key rules: explicit return types, strict boolean expressions, no `any`, no non-null assertions, `console.error` only, curly braces required.
