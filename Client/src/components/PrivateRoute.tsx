import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/api/api";

// Placeholder PrivateRoute component
// In the future, this will check for authentication status

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, accessToken, isTokenValid, logout } =
    useAuth();

  // Set auth header whenever this component renders
  useEffect(() => {
    if (accessToken && isTokenValid()) {
      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
    } else {
      console.warn("No valid access token available in PrivateRoute");
      delete apiClient.defaults.headers.common["Authorization"];

      // If we have an invalid token but the user is still marked as authenticated,
      // we need to force a logout to clear the invalid state
      if (accessToken && !isTokenValid() && isAuthenticated) {
        console.warn(
          "Token is invalid but user marked as authenticated - forcing logout"
        );
        logout();
      }
    }
  }, [accessToken, isTokenValid, isAuthenticated, logout]);

  // Show loading indicator while checking authentication status
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated or no access token
  if (!isAuthenticated || !accessToken || !isTokenValid()) {
    console.warn("Access denied - redirecting to login", {
      isAuthenticated,
      hasAccessToken: !!accessToken,
      isTokenValid: isTokenValid(),
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default PrivateRoute;
