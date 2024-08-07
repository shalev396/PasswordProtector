# Password Protector

A secure application for storing, managing, and generating passwords with end-to-end encryption.

## Project Structure

```
password-protector/
├── backend/        # Node.js (TypeScript) Express API
│   ├── src/
│   ├── dist/       # Compiled TypeScript output
│   ├── node_modules/
│   ├── .env        # Environment variables (DB connection, JWT secret) - MUST BE CREATED
│   ├── .gitignore
│   ├── nodemon.json
│   ├── package.json
│   └── tsconfig.json
├── frontend/       # React (TypeScript) Vite App
│   ├── src/
│   ├── public/
│   ├── node_modules/
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md       # This file
```

## MVP Features (Planned)

- User registration and authentication (JWT)
- Secure password storage (encrypted in DB)
- Password generation tool
- Basic CRUD operations for passwords
- Search and filter passwords
- Password strength analysis (basic)
- Secure sharing functionality (future)
- Basic import/export (future)

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Axios, React Router
- **Backend**: Node.js, Express, TypeScript, CORS
- **Database**: Microsoft SQL Server (MSSQL)
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: Bcrypt

## Setup and Installation

**Prerequisites:**

- Node.js (v18+ recommended)
- npm or yarn
- Microsoft SQL Server instance (local or remote)

**Backend Setup:**

1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file by copying `.env.example` (or create it manually) and fill in your database credentials and a strong `JWT_SECRET`:

    ```env
    # Server Configuration
    PORT=5000

    # Database Configuration (Replace with your credentials)
    DB_USER=
    DB_PASSWORD=
    DB_DATABASE=
    DB_SERVER=localhost
    # Set DB_ENCRYPT to true if using Azure SQL or requires encryption
    DB_ENCRYPT=false
    # Set DB_TRUST_SERVER_CERTIFICATE to true for local dev or self-signed certificates
    DB_TRUST_SERVER_CERTIFICATE=false

    # JWT Configuration (Replace with a strong, random secret)
    JWT_SECRET=your_super_secret_jwt_key_here_at_least_32_chars
    JWT_EXPIRES_IN=1h
    ```

4.  **Database Initialization**: Connect to your SQL Server instance and run the following SQL commands to create the necessary tables (or use a migration tool later):

    ```sql
    -- Create Users Table
    CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );

    -- Create Passwords Table
    CREATE TABLE Passwords (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        website VARCHAR(255),
        username VARCHAR(255),
        encrypted_password TEXT NOT NULL, -- Store encrypted password here
        notes TEXT,
        category VARCHAR(100),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
    );

    -- Optional: Index on user_id for faster lookups
    CREATE INDEX idx_user_id ON Passwords(user_id);
    ```

5.  Run the development server: `npm run dev`
    The backend API will be running on `http://localhost:5000` (or the port specified in `.env`).

**Frontend Setup:**

1.  Navigate to the `frontend` directory: `cd ../frontend` (from backend) or `cd frontend` (from root)
2.  Install dependencies: `npm install`
3.  Run the development server: `npm run dev`
    The frontend application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## Next Steps (Implementation)

- Implement backend API endpoints (Auth, Passwords CRUD).
- Implement encryption/decryption logic for passwords.
- Build frontend components (Login, Register, Dashboard, Password forms/list).
- Connect frontend components to backend API.
- Implement state management (e.g., Context API, Zustand).
- Add authentication flow (login, registration, protected routes).
- Styling with Tailwind CSS.
