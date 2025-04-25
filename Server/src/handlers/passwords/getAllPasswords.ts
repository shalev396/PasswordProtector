import "reflect-metadata";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  formatJSONResponse,
  formatErrorResponse,
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

      // Get all passwords for the authenticated user
      const passwords = await Password.findAll({
        where: { userId: user.id },
        order: [["updatedAt", "DESC"]],
      });

      return formatJSONResponse({
        passwords: passwords,
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
    console.error("Error fetching passwords:", error);
    return formatErrorResponse("Server error", 500);
  } finally {
    await closeConnection();
  }
};
