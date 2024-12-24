import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// JWT secret from environment variable or fallback
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Define a type for the JWT payload
interface JwtPayload {
  id: number;
}

// Extend Express Request interface to include user property
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
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. No token provided.",
      });
    }

    // Get the token part
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Invalid token format.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Find user by id
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["passwordHash"] }, // Exclude password
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or token is invalid.",
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during authentication.",
    });
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
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Check if user exists in database
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("User check error:", error);
    return res.status(500).json({ message: "Error validating user" });
  }
};
