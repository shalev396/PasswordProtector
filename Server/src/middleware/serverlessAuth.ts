import { APIGatewayProxyEvent } from "aws-lambda";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { getTokenFromEvent } from "../utils/apiGateway";

// Use the same JWT secret as auth controller
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Define the structure of the JWT payload
interface JwtPayload {
  id: number;
}

/**
 * Verify JWT token and get user from database
 * Returns the user if authentication succeeds, or throws an error if it fails
 */
export const verifyToken = async (
  event: APIGatewayProxyEvent
): Promise<User> => {
  // Get token from header
  const token = getTokenFromEvent(event);

  if (!token) {
    const error = new Error("Authentication required");
    error.name = "AuthenticationError";
    throw error;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Find user by id
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) {
      const error = new Error("User not found");
      error.name = "AuthenticationError";
      throw error;
    }

    return user;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const tokenError = new Error("Token expired");
      tokenError.name = "TokenExpiredError";
      throw tokenError;
    } else if (error instanceof jwt.JsonWebTokenError) {
      const tokenError = new Error("Invalid token");
      tokenError.name = "InvalidTokenError";
      throw tokenError;
    }

    throw error;
  }
};
