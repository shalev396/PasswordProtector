import dotenv from "dotenv";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import bcrypt from "bcryptjs";
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
// JWT Configuration
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

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    // No authentication required for registration

    // Parse and validate input
    const body = parseBody(event);
    if (!body) {
      return errorResponse("Invalid JSON body", 400);
    }

    const { email, password } = body;

    // Simple validation
    if (!email || !password) {
      return errorResponse("Email and password are required", 400);
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return errorResponse("Please provide a valid email", 400);
    }

    if (password.length < 6) {
      return errorResponse("Password must be at least 6 characters long", 400);
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse("User already exists", 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email,
      passwordHash,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return successResponse(
      {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
        },
      },
      201
    );
  } catch (error) {
    console.error("Error in register handler:", error);
    return errorResponse("Server error", 500);
  }
};
