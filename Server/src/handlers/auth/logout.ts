import dotenv from "dotenv";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { successResponse, errorResponse } from "../../utils/handlerHelper.js";
import { authenticate } from "../../middleware/auth.js";
import sequelize from "../../config/sequelize.js";
import "../../config/bootstrap.js";
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
    if (!authResult.isAuthenticated) {
      return errorResponse(authResult.error || "Not authorized", 401);
    }

    // No need to clear refresh token in database in this implementation
    // If you want to implement token blacklisting, you would do it here

    return successResponse({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout handler:", error);
    return errorResponse("Server error", 500);
  }
};
