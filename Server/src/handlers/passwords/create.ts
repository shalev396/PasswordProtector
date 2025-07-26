import dotenv from "dotenv";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import {
  successResponse,
  errorResponse,
  parseBody,
} from "../../utils/handlerHelper.js";
import { authenticate } from "../../middleware/auth.js";
import sequelize from "../../config/sequelize.js";
import "../../config/bootstrap.js";
import { User } from "../../models/User.js";
import { Password } from "../../models/Password.js";
// Load environment variables
dotenv.config();

// Connect to database
await sequelize.authenticate();

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    // Authentication
    const authResult = await authenticate(event);
    if (!authResult.isAuthenticated || !authResult.user) {
      return errorResponse(authResult.error || "Not authorized", 401);
    }

    const userId = authResult.user.id as number; // Safe because user exists after authentication

    // Parse and validate input
    const body = parseBody(event);
    if (!body) {
      return errorResponse("Invalid JSON body", 400);
    }

    const { title, username, password, website, notes, category } = body;

    // Simple validation
    if (!title || !password) {
      return errorResponse("Title and password are required", 400);
    }

    if (title.length > 100) {
      return errorResponse("Title cannot exceed 100 characters", 400);
    }

    if (username && username.length > 100) {
      return errorResponse("Username cannot exceed 100 characters", 400);
    }

    if (password.length > 255) {
      return errorResponse("Password cannot exceed 255 characters", 400);
    }

    if (website && (!/^https?:\/\/.+/.test(website) || website.length > 255)) {
      return errorResponse(
        "Website must be a valid URL and cannot exceed 255 characters",
        400
      );
    }

    if (notes && notes.length > 1000) {
      return errorResponse("Notes cannot exceed 1000 characters", 400);
    }

    if (category && category.length > 50) {
      return errorResponse("Category cannot exceed 50 characters", 400);
    }

    // Verify user exists
    const userRecord = await User.findByPk(userId);
    if (!userRecord) {
      return errorResponse("User not found", 404);
    }

    // Create the password record
    const newPassword = await Password.create({
      title,
      username,
      password,
      website,
      notes,
      category,
      userId: userId,
    });

    return successResponse(
      {
        password: newPassword,
      },
      201
    );
  } catch (error) {
    console.error("Error in createPassword handler:", error);
    return errorResponse("Server error while creating password", 500);
  }
};
