# Password Protector API - Serverless

This is the serverless backend for the Password Protector application, built with the Serverless Framework.

## Setup

1. **Install dependencies**:

   ```
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory with the following variables:

   ```
   # Database Configuration
   DB_DATABASE=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_SERVER=localhost
   DB_ENCRYPT=false
   DB_TRUST_SERVER_CERTIFICATE=true

   # JWT Configuration
   JWT_SECRET=your_jwt_secret
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d

   # Node Environment
   NODE_ENV=development
   ```

## Local Development

Run the application locally using the Serverless Offline plugin:

```
npm run dev
```

This will start the API locally at http://localhost:5000.

## Deployment

Deploy the application to AWS:

```
npm run deploy
```

To deploy to a specific stage (e.g., production):

```
npm run deploy -- --stage production
```

## Project Structure

- `/src/handlers` - Lambda function handlers
- `/src/models` - Sequelize models
- `/src/middleware` - Middleware functions
- `/src/utils` - Utility functions
- `/src/config` - Configuration files

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/refresh` - Refresh authentication token
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout user

### Passwords

- `GET /api/passwords` - Get all passwords
- `GET /api/passwords/{id}` - Get a specific password
- `POST /api/passwords` - Create a new password
- `PUT /api/passwords/{id}` - Update a password
- `DELETE /api/passwords/{id}` - Delete a password

## Notes on Lambda Functions

Each endpoint is implemented as a separate Lambda function to follow serverless best practices. The functions are optimized for AWS Lambda's environment, with proper connection pooling configuration to avoid database connection issues.

The Sequelize connection is optimized for serverless environments with the following features:

- Connection pooling within the same invocation
- Proper closure of connections between invocations
- Connection cleanup on Lambda timeouts
