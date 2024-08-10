import {
  BrowserRouter as Router,
  Route,
  Routes,
  // Navigate, // No longer needed for default route
} from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx"; // Import LandingPage
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx"; // Import the placeholder

function App() {
  return (
    <Router>
      {/* Remove the outer div/h1 if you want page-specific layouts */}
      {/* <div className="App min-h-screen bg-gray-100 dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-center py-4 text-blue-600 dark:text-blue-400">
          Password Protector
        </h1> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />{" "}
        {/* Set LandingPage as default */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Old default route - removed */}
        {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
        {/* Private Routes - Wrap with PrivateRoute component */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        {/* Optional: Add a 404 Not Found Route */}
        {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
      </Routes>
      {/* </div> */}
    </Router>
  );
}

export default App;
