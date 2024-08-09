import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import LoginPage from './pages/LoginPage'; // Placeholder
// import RegisterPage from './pages/RegisterPage'; // Placeholder
// import DashboardPage from './pages/DashboardPage'; // Placeholder
// import PrivateRoute from './components/PrivateRoute'; // Placeholder

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-100 dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-center py-4 text-blue-600 dark:text-blue-400">
          Password Protector
        </h1>
        <Routes>
          {/* Public Routes */}
          {/* <Route path="/login" element={<LoginPage />} /> */}
          {/* <Route path="/register" element={<RegisterPage />} /> */}
          <Route path="/" element={<div>Home Page Placeholder</div>} />{" "}
          {/* Placeholder for home/login */}
          {/* Private Routes - Wrap with PrivateRoute component */}
          {/* 
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } /> 
          */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
