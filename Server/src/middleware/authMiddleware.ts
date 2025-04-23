import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

// Use the same JWT secret as auth controller to ensure consistent token verification
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Log JWT secret configuration (without revealing the full secret)


// Define the structure of the JWT payload
interface JwtPayload {
  id: number;
}

// Extend the Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Authentication middleware to protect routes
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {


    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      console.error("Authentication failed: No token provided", {
        headers: Object.keys(req.headers),
        hasAuthHeader: !!authHeader,
        authHeader: authHeader
          ? `${authHeader.substring(0, 10)}...`
          : "missing",
      });
      return res.status(401).json({ message: "Authentication required" });
    }

    

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  

    // Find user by id
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) {
      console.error(`User with ID ${decoded.id} not found in database`);
      return res.status(401).json({ message: "User not found" });
    }

    
    // Set user in request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error instanceof jwt.TokenExpiredError) {
      console.error("Token expired error", {
        error: error.message,
        expiredAt: error.expiredAt,
        path: req.path,
        method: req.method,
      });
      return res.status(401).json({
        message: "Token expired",
        code: "TOKEN_EXPIRED",
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error("Invalid token error", {
        error: error.message,
        path: req.path,
        method: req.method,
      });
      return res.status(401).json({
        message: "Invalid token",
        code: "INVALID_TOKEN",
      });
    }

    console.error("Unknown authentication error", {
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      path: req.path,
      method: req.method,
    });
    return res.status(401).json({ message: "Authentication failed" });
  }
};

/**
 * Middleware to check if the authenticated user exists in the database
 * Should be used after the authenticate middleware
 */
export const checkUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not found" });
  }
  next();
};
