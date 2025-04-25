import "reflect-metadata";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  formatJSONResponse,
  formatErrorResponse,
  getPathParameters,
} from "../../utils/apiGateway";
import { verifyToken } from "../../middleware/serverlessAuth";
import Password from "../../models/Password";
import { connectDB, closeConnection } from "../../config/sequelize";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await connectDB();

    // Authenticate user
    try {
      const user = await verifyToken(event);

      const pathParams = getPathParameters(event);
      const passwordId = parseInt(pathParams.id);

      if (isNaN(passwordId)) {
        return formatErrorResponse("Invalid password ID", 400);
      }

      // Find the password and ensure it belongs to this user
      const password = await Password.findOne({
        where: {
          id: passwordId,
          userId: user.id,
        },
      });

      if (!password) {
        return formatErrorResponse("Password not found", 404);
      }

      await password.destroy();

      return formatJSONResponse({
        message: "Password deleted successfully",
      });
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
    console.error("Error deleting password:", error);
    return formatErrorResponse("Server error", 500);
  } finally {
    await closeConnection();
  }
};
