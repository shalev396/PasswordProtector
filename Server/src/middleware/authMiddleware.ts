import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";

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
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify token
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;

    // Find user by id
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Set user in request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Token expired",
        code: "TOKEN_EXPIRED",
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Invalid token",
        code: "INVALID_TOKEN",
      });
    }

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
