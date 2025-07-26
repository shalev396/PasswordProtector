import dotenv from "dotenv";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { successResponse, errorResponse } from "../../utils/handlerHelper.js";
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

    // Get the password by ID and verify it belongs to the authenticated user
    const password = await Password.findOne({
      where: {
        id: passwordId,
        userId: userId,
      },
    });

    if (!password) {
      return errorResponse("Password not found", 404);
    }

    return successResponse({
      password: password,
    });
  } catch (error) {
    console.error("Error in getPasswordById handler:", error);
    return errorResponse("Server error", 500);
  }
};
