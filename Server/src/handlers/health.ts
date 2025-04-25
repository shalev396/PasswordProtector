import "reflect-metadata";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "../utils/apiGateway";
import { connectDB, closeConnection } from "../config/sequelize";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Connect to the database and test connection
    await connectDB();

    return formatJSONResponse({
      message: "Password Protector API Running!",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check error:", error);
    return formatJSONResponse(
      {
        message: "Service is experiencing issues",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  } finally {
    // Close database connection
    await closeConnection();
  }
};
