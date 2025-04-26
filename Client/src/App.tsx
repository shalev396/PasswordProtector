import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx"; // Import LandingPage
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import AddItemPage from "./pages/AddItemPage.tsx"; // Import AddItemPage
import EditItemPage from "./pages/EditItemPage.tsx"; // Import EditItemPage
import NotFoundPage from "./pages/NotFoundPage.tsx"; // Import NotFoundPage

import PrivateRoute from "./components/PrivateRoute.tsx"; // Import the placeholder
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/queryClient"; // Import centralized queryClient

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />{" "}
        {/* Set LandingPage as default */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Private Routes - Wrap with PrivateRoute component */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/add"
          element={
            <PrivateRoute>
              <AddItemPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <EditItemPage />
            </PrivateRoute>
          }
        />
        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
