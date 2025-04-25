import "reflect-metadata";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  formatJSONResponse,
  formatErrorResponse,
} from "../../utils/apiGateway";
import { verifyToken } from "../../middleware/serverlessAuth";
import { connectDB, closeConnection } from "../../config/sequelize";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await connectDB();

    // Authenticate user
    try {
      const user = await verifyToken(event);
      return formatJSONResponse({ user });
    } catch (error: any) {
      if (error?.name === "AuthenticationError") {
        return formatErrorResponse(
          error.message || "Authentication required",
          401
        );
      } else if (error?.name === "TokenExpiredError") {
        return formatErrorResponse("Token expired", 401, {
          code: "TOKEN_EXPIRED",
        });
      } else if (error?.name === "InvalidTokenError") {
        return formatErrorResponse("Invalid token", 401, {
          code: "INVALID_TOKEN",
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Get profile error:", error);
    return formatErrorResponse("Server error", 500);
  } finally {
    await closeConnection();
  }
};
