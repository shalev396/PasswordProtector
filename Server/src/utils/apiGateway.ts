import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { validationResult, ValidationChain } from "express-validator";

// Define our own ValidationError type since we're having issues importing it
interface ValidationError {
  type: string;
  value: any;
  msg: string;
  path: string;
  location: string;
}

/**
 * Format a successful response for API Gateway
 */
export const formatJSONResponse = (
  response: Record<string, any>,
  statusCode: number = 200
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response),
  };
};

/**
 * Format an error response for API Gateway
 */
export const formatErrorResponse = (
  message: string,
  statusCode: number = 500,
  errors?: any
): APIGatewayProxyResult => {
  return formatJSONResponse({ message, errors }, statusCode);
};

/**
 * Parse the token from the Authorization header
 */
export const getTokenFromEvent = (
  event: APIGatewayProxyEvent
): string | null => {
  const authHeader = event.headers.Authorization || event.headers.authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;

  return parts[1];
};

/**
 * Parse the request body as JSON
 */
export const parseBody = <T>(event: APIGatewayProxyEvent): T | null => {
  if (!event.body) return null;
  try {
    return JSON.parse(event.body) as T;
  } catch (error) {
    console.error("Error parsing request body:", error);
    return null;
  }
};

/**
 * Get path parameters from the event
 */
export const getPathParameters = (
  event: APIGatewayProxyEvent
): Record<string, any> => {
  return event.pathParameters || {};
};

/**
 * Get query string parameters from the event
 */
export const getQueryParameters = (
  event: APIGatewayProxyEvent
): Record<string, any> => {
  return event.queryStringParameters || {};
};

/**
 * Run express-validator validations on an API Gateway event
 */
export const runValidation = async (
  event: APIGatewayProxyEvent,
  validations: ValidationChain[]
): Promise<ValidationError[] | null> => {
  // Express-validator expects a request object with body, query, and params
  const req: any = {
    body: parseBody(event),
    query: getQueryParameters(event),
    params: getPathParameters(event),
  };

  // Run all validations
  await Promise.all(validations.map((validation) => validation.run(req)));

  // Get validation results
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return null;
  }

  return errors.array() as ValidationError[];
};
