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

    // Get all passwords for the authenticated user
    const passwords = await Password.findAll({
      where: { userId: userId },
      order: [["updatedAt", "DESC"]],
    });

    return successResponse({
      passwords: passwords,
    });
  } catch (error) {
    console.error("Error in getAllPasswords handler:", error);
    return errorResponse("Server error", 500);
  }
};
