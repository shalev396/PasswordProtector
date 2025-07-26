import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { successResponse, errorResponse } from "../utils/handlerHelper.js";

export const handler = async (
  _event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    // Return success response
    return successResponse({
      message: "Password Protector API Running!",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in health handler:", error);
    return errorResponse("Service is experiencing issues", 500);
  }
};
