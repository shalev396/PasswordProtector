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
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name").optional(),
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

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return formatErrorResponse("User already exists", 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email,
      passwordHash,
    } as User);

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return formatJSONResponse(
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
    console.error("Registration error:", error);
    return formatErrorResponse("Server error", 500);
  } finally {
    await closeConnection();
  }
};
