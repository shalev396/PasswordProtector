import { APIGatewayProxyEventV2 } from "aws-lambda";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";


export interface AuthResult {
  isAuthenticated: boolean;
  user?: User;
  error?: string;
}

/**
 * Authenticate request using JWT token from Authorization header
 * @param event API Gateway event
 * @returns Authentication result
 */
export const authenticate = async (
  event: APIGatewayProxyEventV2
): Promise<AuthResult> => {
  let token: string | undefined;

  // Check for token in headers
  const authHeader =
    event.headers["Authorization"] || event.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Set token from Bearer token in header
    token = authHeader.split(" ")[1];
  }

  // Make sure token exists
  if (!token) {
    return {
      isAuthenticated: false,
      error: "Not authorized to access this route",
    };
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env["JWT_SECRET"] as string) as {
      id: number;
    };

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) {
      return {
        isAuthenticated: false,
        error: "Not authorized to access this route",
      };
    }

    return {
      isAuthenticated: true,
      user,
    };
  } catch (err) {
    return {
      isAuthenticated: false,
      error: "Not authorized to access this route",
    };
  }
};
