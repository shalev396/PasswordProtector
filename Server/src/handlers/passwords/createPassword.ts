import "reflect-metadata";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  formatJSONResponse,
  formatErrorResponse,
  parseBody,
  runValidation,
} from "../../utils/apiGateway";
import { verifyToken } from "../../middleware/serverlessAuth";
import Password from "../../models/Password";
import User from "../../models/User";
import { createPasswordValidation } from "../../middleware/passwordValidation";
import { connectDB, closeConnection } from "../../config/sequelize";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await connectDB();

    // Authenticate user
    try {
      const user = await verifyToken(event);

      // Validate input
      const validationErrors = await runValidation(
        event,
        createPasswordValidation
      );
      if (validationErrors) {
        return formatErrorResponse("Validation failed", 400, validationErrors);
      }

      const { title, username, password, website, notes, category } =
        parseBody<{
          title: string;
          username?: string;
          password: string;
          website?: string;
          notes?: string;
          category?: string;
        }>(event) || {};

      if (!title || !password) {
        return formatErrorResponse("Title and password are required", 400);
      }

      // Verify user exists
      const userRecord = await User.findByPk(user.id);
      if (!userRecord) {
        return formatErrorResponse("User not found", 404);
      }

      // Create the password record
      const newPassword = await Password.create({
        title,
        username,
        password,
        website,
        notes,
        category,
        userId: user.id,
      } as any);

      return formatJSONResponse(
        {
          password: newPassword,
        },
        201
      );
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
    console.error("Error creating password:", error);
    return formatErrorResponse("Server error while creating password", 500);
  } finally {
    await closeConnection();
  }
};
