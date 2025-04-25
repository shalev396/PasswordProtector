import "reflect-metadata";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  formatJSONResponse,
  formatErrorResponse,
  parseBody,
  getPathParameters,
  runValidation,
} from "../../utils/apiGateway";
import { verifyToken } from "../../middleware/serverlessAuth";
import Password from "../../models/Password";
import { updatePasswordValidation } from "../../middleware/passwordValidation";
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
        updatePasswordValidation
      );
      if (validationErrors) {
        return formatErrorResponse("Validation failed", 400, validationErrors);
      }

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

      // Parse update data
      const {
        title,
        username,
        password: newPassword,
        website,
        notes,
        category,
      } = parseBody<{
        title?: string;
        username?: string;
        password?: string;
        website?: string;
        notes?: string;
        category?: string;
      }>(event) || {};

      // Update only the fields that were provided
      const updatedFields: any = {};
      if (title !== undefined) updatedFields.title = title;
      if (username !== undefined) updatedFields.username = username;
      if (newPassword !== undefined) updatedFields.password = newPassword;
      if (website !== undefined) updatedFields.website = website;
      if (notes !== undefined) updatedFields.notes = notes;
      if (category !== undefined) updatedFields.category = category;

      await password.update(updatedFields);

      return formatJSONResponse({
        password: password,
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
    console.error("Error updating password:", error);
    return formatErrorResponse("Server error", 500);
  } finally {
    await closeConnection();
  }
};
