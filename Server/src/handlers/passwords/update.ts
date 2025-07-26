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

    // Extract path parameters
    const id = event.pathParameters?.["id"];
    if (!id) {
      return errorResponse("ID is required", 400);
    }

    const passwordId = parseInt(id);
    if (isNaN(passwordId)) {
      return errorResponse("Invalid password ID", 400);
    }

    // Find the password and ensure it belongs to this user
    const password = await Password.findOne({
      where: {
        id: passwordId,
        userId: userId,
      },
    });

    if (!password) {
      return errorResponse("Password not found", 404);
    }

    // Parse and validate input
    const body = parseBody(event);
    if (!body) {
      return errorResponse("Invalid JSON body", 400);
    }

    const {
      title,
      username,
      password: newPassword,
      website,
      notes,
      category,
    } = body;

    // Simple validation for provided fields
    if (title !== undefined && title.length > 100) {
      return errorResponse("Title cannot exceed 100 characters", 400);
    }

    if (username !== undefined && username.length > 100) {
      return errorResponse("Username cannot exceed 100 characters", 400);
    }

    if (newPassword !== undefined && newPassword.length > 255) {
      return errorResponse("Password cannot exceed 255 characters", 400);
    }

    if (
      website !== undefined &&
      (!/^https?:\/\/.+/.test(website) || website.length > 255)
    ) {
      return errorResponse(
        "Website must be a valid URL and cannot exceed 255 characters",
        400
      );
    }

    if (notes !== undefined && notes.length > 1000) {
      return errorResponse("Notes cannot exceed 1000 characters", 400);
    }

    if (category !== undefined && category.length > 50) {
      return errorResponse("Category cannot exceed 50 characters", 400);
    }

    // Update only the fields that were provided
    const updatedFields: any = {};
    if (title !== undefined) updatedFields.title = title;
    if (username !== undefined) updatedFields.username = username;
    if (newPassword !== undefined) updatedFields.password = newPassword;
    if (website !== undefined) updatedFields.website = website;
    if (notes !== undefined) updatedFields.notes = notes;
    if (category !== undefined) updatedFields.category = category;

    await password.update(updatedFields);

    return successResponse({
      password: password,
    });
  } catch (error) {
    console.error("Error in updatePassword handler:", error);
    return errorResponse("Server error", 500);
  }
};
