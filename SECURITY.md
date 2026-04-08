# Security Policy

## Supported Versions

Password Protector is actively maintained on the `main` branch

| Version / Branch      | Supported |
| --------------------- | --------- |
| `main`                | ✅        |
| Older commits / forks | ❌        |

## Reporting a Vulnerability

Please do **not** open a public GitHub issue for security vulnerabilities.

Use [GitHub private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability) for this repository.

Include:

- affected area (`client`, `server`, `deployment`, Cognito/JWT, crypto, API auth, database, CloudFront/S3, CI, etc.)
- reproduction steps
- impact assessment
- proof of concept if available
- suggested fix if you have one

## Response Expectations

Maintainers will try to:

- acknowledge reports within 7 days
- validate and triage as soon as possible
- coordinate disclosure after a fix is ready

## Scope

Examples of **in-scope** areas:

- authentication and authorization (AWS Cognito, JWT verification, private vs public API routes)
- token handling (ID token, refresh token, session storage usage)
- client-side cryptography (AES-256-GCM, PBKDF2 key derivation, master password handling)
- ciphertext integrity and API behavior around encrypted password fields
- account and password CRUD authorization (user isolation, IDOR-style issues)
- rate limiting and abuse of public auth endpoints
- email-related abuse vectors (Cognito/SES flows)
- insecure default cloud or Serverless configuration in this repository
- accidental secret exposure in code, CI, or artifacts
- data export (`/api/private/me/export`) if it leaks data across users or bypasses auth

**Out of scope:**

- issues that only affect modified downstream forks without merging fixes upstream
- deployment or hardening choices in a fork or custom environment that diverge from this repo’s documented setup
- compromise of an end user’s device or browser (e.g. malware reading memory or local storage) — report client-side risks that are fixable in this codebase as in-scope; generic endpoint security is not
