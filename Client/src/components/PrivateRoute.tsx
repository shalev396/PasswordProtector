import React from "react";
// import { Navigate } from 'react-router-dom'; // Keep for later

// Placeholder PrivateRoute component
// In the future, this will check for authentication status

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = true; // Placeholder: Replace with actual auth check logic

  // If not authenticated, redirect to login page (implement later)
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  // If authenticated, render the children components
  return <>{children}</>;
};

export default PrivateRoute;
