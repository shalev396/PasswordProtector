import "reflect-metadata";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import bcrypt from "bcryptjs";
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

// Validation rules
const validations = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").exists().withMessage("Password is required"),
];

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

    const { email, password } =
      parseBody<{ email: string; password: string }>(event) || {};

    if (!email || !password) {
      return formatErrorResponse("Email and password are required", 400);
    }

    // Find the user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return formatErrorResponse("Invalid credentials", 400);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return formatErrorResponse("Invalid credentials", 400);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return formatJSONResponse({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return formatErrorResponse("Server error", 500);
  } finally {
    await closeConnection();
  }
};
