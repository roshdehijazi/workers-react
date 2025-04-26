import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import { Box } from "@mui/material";

// Imports Customer pages
import Home from "./components/customer/home";
import Profile from './components/customer/profile';
import Contact from './components/customer/contact';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
      setIsAuthenticated(true);
      setUserRole(user.role);
    }
  }, []);

  const getRedirectPath = () => {
    if (userRole === "Customer") return "/customer/home";
    if (userRole === "Worker") return "/worker/home";
    if (userRole === "Admin") return "/admin/home";
    return "/login"; // fallback
  };

  return (
    <Router>
      <Box sx={{ minHeight: "100vh" }}>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to={getRedirectPath()} />
              ) : (
                <Login setAuth={setIsAuthenticated} setUserRole={setUserRole} />
              )
            }
          />

          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to={getRedirectPath()} />
              ) : (
                <Register setAuth={setIsAuthenticated} />
              )
            }
          />

          <Route
            path="/customer/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />

          <Route
            path="/customer/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />

          <Route
            path="/customer/contact"
            element={isAuthenticated ? <Contact /> : <Navigate to="/login" />}
          />
          {/* Later: Worker, Admin Routes */}

          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to={getRedirectPath()} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
