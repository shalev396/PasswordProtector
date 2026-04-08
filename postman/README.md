# PasswordProtector Backend API Tests (Postman)

[← Back to main README](../README.md)

Run these against a live API or serverless offline. API tests use the **Postman CLI** or **Postman desktop app**. For frontend E2E tests (Playwright), see [client/tests/README.md](../client/tests/README.md).

## Import

1. **Collection**: Import `postman/collections/PasswordProtector API` (V3 folder format).
2. **Environments**: Import `postman/environments/PasswordProtector Local.environment.yaml` and `postman/environments/PasswordProtector QA.environment.yaml`.

## What to Change Before Running

### 1. Environment -- Base URL

| File                                                                   | Variable  | Default value                                     | Change to                       |
| ---------------------------------------------------------------------- | --------- | ------------------------------------------------- | ------------------------------- |
| `postman/environments/PasswordProtector QA.environment.yaml`           | `baseUrl` | `https://qa.password-protector.shalev396.com/api` | `https://qa.yourdomain.com/api` |
| `postman/collections/PasswordProtector API/.resources/definition.yaml` | `baseUrl` | `https://qa.password-protector.shalev396.com/api` | Same as QA environment above    |

In your active environment, set `baseUrl`:

- **Local**: `http://localhost:3000/api` (run `npm run dev` from `server/` first)
- **QA**: Your QA API URL, e.g. `https://qa.yourdomain.com/api`

### 2. Authentication -- Tokens

Tokens are set automatically when you run the collection (Login and Mail.tm flows save them). If you run individual requests or your environment resets:

- `idToken` -- From login; used for PasswordProtector API (`/private/me`, `/private/passwords`, etc.)
- `mailTmToken` -- From Mail.tm Get Token; used for `api.mail.tm` (Poll Inbox, Read Message)

Paste values into the environment if needed. The collection uses beforeRequest scripts to add `Authorization: Bearer <token>` from these variables.

## CLI Commands

From `server/`:

```bash
npm run test:local  # Against http://localhost:3000/api
npm run test:qa     # Against QA (baseUrl from PasswordProtector QA.environment.yaml)
```

Configure `baseUrl` in each environment file (Local: `postman/environments/PasswordProtector Local.environment.yaml`, QA: `postman/environments/PasswordProtector QA.environment.yaml`). The collection `postman/collections/PasswordProtector API/.resources/definition.yaml` also has a `baseUrl` variable -- keep it in sync with your QA environment.

## Collection Structure

The collection runs sequentially in this order:

### 1. Setup (9 requests)

Provisions a test account: resets the database, creates a temporary email via Mail.tm, signs up, polls for the verification code, confirms, and logs in. Saves `idToken`, `refreshToken`, and other variables for all subsequent tests.

### 2. Auth (27 requests)

Endpoint coverage for all authentication routes:

| Folder              | Endpoint                            | Requests                                                                                                                     |
| ------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Login**           | `POST /public/auth/login`           | 7 (valid credentials, wrong password, unregistered email, wrong email+password, missing email, missing password, empty body) |
| **Signup**          | `POST /public/auth/signup`          | 5 (missing email, missing password, missing name, duplicate email, weak password)                                            |
| **Confirm**         | `POST /public/auth/confirm`         | 3 (missing email, missing code, invalid code)                                                                                |
| **Token Refresh**   | `POST /public/auth/refresh`         | 3 (valid token, invalid token, missing token)                                                                                |
| **Forgot Password** | `POST /public/auth/forgot-password` | 4 (valid email, nonexistent email, missing email, invalid email format)                                                      |
| **Reset Password**  | `POST /public/auth/reset-password`  | 5 (invalid code, missing fields, missing email, missing code, missing password)                                              |

### 3. User (10 requests)

Endpoint coverage for private account routes (all require `Authorization: Bearer <idToken>`):

| Folder             | Endpoint                 | Requests                                            |
| ------------------ | ------------------------ | --------------------------------------------------- |
| **Get Me**         | `GET /private/me`        | 3 (valid token, no token, invalid token)            |
| **Update Me**      | `PUT /private/me`        | 4 (change name, restore name, no token, no changes) |
| **Export Me**      | `GET /private/me/export` | 2 (valid token, no token)                           |
| **Delete Account** | `DELETE /private/delete` | 1 (no token -- expects 401)                         |

### 4. Passwords (22 requests)

Endpoint coverage for password CRUD routes (all require `Authorization: Bearer <idToken>`):

| Folder                | Endpoint                        | Requests                                                                               |
| --------------------- | ------------------------------- | -------------------------------------------------------------------------------------- |
| **Create Password**   | `POST /private/passwords`       | 5 (valid data, missing title, missing password, no token, invalid token)               |
| **Get All Passwords** | `GET /private/passwords`        | 3 (valid token, no token, invalid token)                                               |
| **Get One Password**  | `GET /private/passwords/:id`    | 4 (valid token, no token, invalid token, non-existent ID)                              |
| **Update Password**   | `PUT /private/passwords/:id`    | 6 (valid update, partial update, non-existent ID, no changes, no token, invalid token) |
| **Delete Password**   | `DELETE /private/passwords/:id` | 4 (valid delete, non-existent ID, no token, invalid token)                             |

**Key behaviors tested:**

- List endpoint (`GET /private/passwords`) returns items **without** the `password` field
- Single fetch (`GET /private/passwords/:id`) returns the **full** record including decrypted `password`
- Create requires non-empty `title` and `password` (400 if empty string)
- Update with empty body returns 400 ("No changes provided")
- Non-existent UUID returns 404

### 5. Flows (29 requests)

User interaction flows that mimic real user journeys, organized by topic:

#### Auth Flows

| Flow                  | Requests | Journey                                                                                                                                |
| --------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Signup**            | 8        | Get Mail.tm Domains -> Create Mail.tm Account -> Get Mail.tm Token -> Sign Up -> Poll Inbox -> Read Message -> Confirm Signup -> Login |
| **Login and Refresh** | 4        | Login -> Get Me -> Refresh Token -> Get Me with New Token                                                                              |
| **Forgot Password**   | 6        | Re-auth Mail.tm -> Request Reset -> Poll Inbox -> Read Reset Email -> Reset Password -> Login with New Password                        |

#### Password Flows

| Flow              | Requests | Journey                                                                                                           |
| ----------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| **Password CRUD** | 8        | Login -> Create Password -> Get All -> Get One -> Update -> Get Updated -> Delete -> Verify Deletion (expect 404) |

#### User Flows

| Flow               | Requests | Journey                                                   |
| ------------------ | -------- | --------------------------------------------------------- |
| **Export Data**    | 3        | Login -> Get Me -> Export Me (runs before Delete Account) |
| **Delete Account** | 3        | Login -> Get Me -> Delete Account                         |

## Auth Middleware Testing

All `/private/*` endpoints use the same `expressAuth` middleware. No-token and invalid-token edge cases are tested comprehensively on `GET /private/me`. Other authenticated endpoints include a single no-token sanity check each.

### Response shape and status codes

Successful responses use `{ data: T }` (no `success` field). Error responses use `{ message: string }`. Success vs failure is determined by the HTTP status code, not a boolean in the JSON body.

### 401 Response Format: Local vs QA/Prod

Protected routes (`/private/*`) use the **API Gateway Cognito JWT authorizer** when deployed. The "Response indicates failure" assertion in no-token and invalid-token tests checks for a non-2xx status and an error-style body (typically `{ message: ... }`).

| Environment                    | Who responds                                   | Body (typical)                |
| ------------------------------ | ---------------------------------------------- | ----------------------------- |
| **Local** (serverless-offline) | Lambda + `expressAuth`                         | `{ message: string }`         |
| **QA/Prod** (deployed)         | API Gateway Cognito authorizer (before Lambda) | `{ message: "Unauthorized" }` |

Local tests hit the Lambda because serverless-offline bypasses the authorizer (`noAuth: true`). In QA/prod, the authorizer rejects invalid/missing tokens before the Lambda is invoked, so the response comes from API Gateway, not our app.

## Total: 97 requests

- Setup: 9
- Auth: 27
- User: 10
- Passwords: 22
- Flows: 29 (Auth: 18 + Passwords: 8 + User: 6)

Note: The Setup account is not explicitly deleted -- it is cleaned up by the "Reset Database" step at the start of the next run. The Signup flow creates a separate account for flow testing, which is deleted by the Delete Account flow at the end.
