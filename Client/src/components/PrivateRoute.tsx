import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/services/authService";

// Placeholder PrivateRoute component
// In the future, this will check for authentication status

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  useEffect(() => {
    // Check authentication when component mounts
    if (!authenticated) {
      navigate("/login", { replace: true });
    }
  }, [authenticated, navigate]);

  // If not authenticated, redirect to login page
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children components
  return <>{children}</>;
};

export default PrivateRoute;
