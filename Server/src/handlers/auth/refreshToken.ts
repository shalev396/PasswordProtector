import "reflect-metadata";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { User } from "../../models/User";
import {
  formatJSONResponse,
  formatErrorResponse,
  parseBody,
  runValidation,
} from "../../utils/apiGateway";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../controllers/authController";
import { connectDB, closeConnection } from "../../config/sequelize";

// Use the same JWT secret as auth controller
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Validation rules
const validations = [
  body("refreshToken").exists().withMessage("Refresh token is required"),
];

// Define the structure of the JWT payload
interface JwtPayload {
  id: number;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await connectDB();

    // Validate input
    const validationErrors = await runValidation(event, validations);
    if (validationErrors) {
      return formatErrorResponse("Validation failed", 400, validationErrors);
    }

    const { refreshToken } = parseBody<{ refreshToken: string }>(event) || {};

    if (!refreshToken) {
      return formatErrorResponse("Refresh token is required", 401);
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload;

      // Find user by id
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["passwordHash"] },
      });

      if (!user) {
        return formatErrorResponse("User not found", 404);
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken(user.id);
      const newRefreshToken = generateRefreshToken(user.id);

      return formatJSONResponse({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: user,
      });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return formatErrorResponse("Refresh token expired", 403);
      } else if (error instanceof jwt.JsonWebTokenError) {
        return formatErrorResponse("Invalid refresh token", 403);
      }
      throw error;
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    return formatErrorResponse("Server error", 500);
  } finally {
    await closeConnection();
  }
};
