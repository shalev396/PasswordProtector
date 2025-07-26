import { APIGatewayProxyResultV2, APIGatewayProxyEventV2 } from "aws-lambda";

/**
 * Create a standardized API Gateway response
 * @param statusCode HTTP status code
 * @param body Response body object
 * @param headers Optional headers
 * @returns APIGatewayProxyResult
 */
export const createResponse = (
  statusCode: number,
  body: any,
  headers?: { [key: string]: string }
): APIGatewayProxyResultV2 => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      ...headers,
    },
    body: JSON.stringify(body),
  };
};

/**
 * Create a success response
 * @param data Response data
 * @param statusCode Optional status code (default: 200)
 * @returns APIGatewayProxyResult
 */
export const successResponse = (
  data: any,
  statusCode: number = 200
): APIGatewayProxyResultV2 => {
  return createResponse(statusCode, {
    success: true,
    ...data,
  });
};

/**
 * Create an error response
 * @param error Error message
 * @param statusCode Optional status code (default: 500)
 * @returns APIGatewayProxyResult
 */
export const errorResponse = (
  error: string,
  statusCode: number = 500
): APIGatewayProxyResultV2 => {
  return createResponse(statusCode, {
    success: false,
    error,
  });
};

export const parseBody = (event: APIGatewayProxyEventV2): any => {
  return JSON.parse(event.body || "{}");
};
