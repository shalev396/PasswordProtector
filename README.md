# Password Protector

A modern, secure password management solution built with end-to-end encryption. Password Protector helps you store and manage your passwords with zero-knowledge architecture, ensuring your sensitive data remains protected and accessible only to you.

## Table of Contents

- [Features](#features)
- [Security Architecture](#security-architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Zero-Knowledge Architecture**: Your data is encrypted before leaving your device
- **End-to-End Encryption**: AES-256-GCM encryption for all sensitive data
- **Modern UI/UX**: Clean, responsive interface built with React and Tailwind CSS
- **Password Generator**: Built-in secure password generator
- **Dark/Light Mode**: Full theme support with system preference detection
- **Cross-Platform**: Web-based solution accessible from any modern browser
- **Responsive Design**: Optimized for both desktop and mobile devices

## Security Architecture

### Client-Side Encryption

- **Master Password**: Never stored or transmitted to the server
- **Encryption Algorithm**: AES-256-GCM with unique IV for each encryption
- **Key Derivation**: PBKDF2 with 100,000 iterations for master key generation
- **Additional Security**: Environment variable secret added to password hash
- **Salt Generation**: Unique salt for each encrypted item
- **Zero-Knowledge Design**: Server never has access to unencrypted data

### Authentication

- **JWT-Based**: Secure token-based authentication
- **Token Refresh**: Automatic token refresh mechanism
- **Session Management**: Secure session handling with expiration

## Tech Stack

### Frontend

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit with Redux Persist
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios with interceptors
- **Form Handling**: React Hook Form with Zod validation

### Backend

- **Runtime**: Node.js with Express
- **Database**: Microsoft SQL Server
- **ORM**: Sequelize with TypeScript
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **API Security**: CORS, Helmet

## Installation

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Microsoft SQL Server instance
- Git

### GitHub Secrets Setup

For production deployments using GitHub Actions, you need to configure the following repository secret:

- **PROD_ENV**: Contains all production environment variables from your `.env` file + deployment secrets

  - Example format (replace with your actual values):

  ```
  # AWS Deployment Credentials
  AWS_ACCESS_CONNECT_KEY=<Your AWS access key for deployments>
  AWS_ACCESS_SECRET=<Your AWS secret access key>
  S3_BUCKET_NAME=<Name of the S3 bucket for static files>
  CLOUDFRONT_DISTRIBUTION_ID=<CloudFront distribution ID for CDN>

  # Serverless Framework Credentials
  SLS_ACCESS_KEY=<Your Serverless Framework access key>

  # Server Configuration
  PORT=5000

  # Database Configuration
  DB_SERVER=<SQL Server hostname or IP>
  DB_DATABASE=<Database name>
  DB_USER=<Database username>
  DB_PASSWORD=<Database password>
  DB_PORT=<Database port, typically 1433 for SQL Server>
  DB_ENCRYPT=<true/false - whether to use encryption for DB connection>
  DB_TRUST_SERVER_CERTIFICATE=<true/false - whether to trust server certificate>

  # Authentication
  JWT_SECRET=<Strong secret key for JWT token generation>
  ACCESS_TOKEN_EXPIRY=<Access token expiry time, e.g. '1h'>
  REFRESH_TOKEN_EXPIRY=<Refresh token expiry time, e.g. '7d'>

  # Add any other environment variables needed for production
  ```

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/password-protector.git

cd password-protector

# Install frontend dependencies
cd Client
npm install

# Create .env file for frontend
cp .env.example .env

# Start development server
npm run dev
```

Required client-side environment variables:

```env
# Security Settings - Critical for encryption strength
VITE_APP_SECRET=your_strong_random_secret_key
```

> **IMPORTANT**: The `VITE_APP_SECRET` environment variable enhances the security of the master key derivation process. This secret is combined with the user's password and email during key generation, ensuring that even if two users have the exact same password and email, their encryption keys will differ between deployments with different secrets.

### Backend Setup

```bash
# Navigate to server directory
cd Server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Edit .env with your database credentials and JWT secret
```

Required environment variables:

```env
# Server Configuration
PORT=5000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name
DB_SERVER=localhost
JWT_SECRET=your_secure_jwt_secret
```

### Database Setup

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
    encrypted_password TEXT NOT NULL,
    notes TEXT,
    category VARCHAR(100),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
```

### Example API Usage

```typescript
// Authentication
const login = async (email: string, password: string) => {
  const response = await axios.post("/api/auth/login", { email, password });
  return response.data;
};

// Password Management
const createPassword = async (passwordData: PasswordData) => {
  const encrypted = await encryptPassword(passwordData.password, masterKey);
  const response = await axios.post("/api/passwords", {
    ...passwordData,
    password: encrypted,
  });
  return response.data;
};
```

### Example React Component

```tsx
const PasswordList: React.FC = () => {
  const [passwords, setPasswords] = useState<Password[]>([]);

  useEffect(() => {
    const fetchPasswords = async () => {
      const data = await getPasswords();
      setPasswords(data);
    };
    fetchPasswords();
  }, []);

  return (
    <div className="grid gap-4">
      {passwords.map((password) => (
        <PasswordCard key={password.id} password={password} />
      ))}
    </div>
  );
};
```

## Usage

1. Register an account with a strong master password
2. Log in to access your vault
3. Add passwords, secure notes, or payment cards
4. Use the password generator for strong passwords
5. Search, filter, and organize your items
6. Access your vault from any device

### Security Best Practices

- Use a strong, unique master password
- Enable two-factor authentication if available
- Regularly update your master password
- Log out when using shared devices
- Keep your browser and system updated

## Contributing

We welcome contributions! Please follow these steps:

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/password-protector.git

# Create a new branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m 'Add amazing feature'

# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request
```

### Development Guidelines

- Follow TypeScript best practices
- Maintain existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful React components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Lucide](https://lucide.dev/) for icons
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management
- [Vite](https://vitejs.dev/) for frontend tooling
