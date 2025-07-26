import dotenv from "dotenv";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import jwt from "jsonwebtoken";
import {
  successResponse,
  errorResponse,
  parseBody,
} from "../../utils/handlerHelper.js";
import { User } from "../../models/User.js";
import sequelize from "../../config/sequelize.js";
import "../../config/bootstrap.js";
// Load environment variables
dotenv.config();

// Connect to database
await sequelize.authenticate();

// Use the same JWT secret as auth controller
const JWT_SECRET = process.env["JWT_SECRET"] || "your_jwt_secret";
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

/**
 * Generate JWT access token
 */
const generateAccessToken = (userId: number): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

/**
 * Generate JWT refresh token
 */
const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

// Define the structure of the JWT payload
interface JwtPayload {
  id: number;
}

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    // No authentication required for refresh token

    // Parse and validate input
    const body = parseBody(event);
    if (!body) {
      return errorResponse("Invalid JSON body", 400);
    }

    const { refreshToken } = body;

    if (!refreshToken) {
      return errorResponse("Refresh token is required", 401);
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload;

      // Find user by id
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["passwordHash"] },
      });

      if (!user) {
        return errorResponse("User not found", 404);
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken(user.id);
      const newRefreshToken = generateRefreshToken(user.id);

      return successResponse({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: user,
      });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return errorResponse("Refresh token expired", 403);
      } else if (error instanceof jwt.JsonWebTokenError) {
        return errorResponse("Invalid refresh token", 403);
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in refreshToken handler:", error);
    return errorResponse("Server error", 500);
  }
};
