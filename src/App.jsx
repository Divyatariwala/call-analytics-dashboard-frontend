import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/dashboard/Login";
import Signup from "./components/dashboard/Signup";
import Dashboard from "./pages/DashboardPage";
import { useState, useEffect } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Inline PrivateRoute
  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;