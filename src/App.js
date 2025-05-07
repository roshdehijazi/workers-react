import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box } from "@mui/material";

// Auth pages
import Login from "./components/login";
import Register from "./components/register";

// Customer pages
import Home from "./components/customer/home";
import Profile from "./components/customer/profile";
import Contact from "./components/customer/contact";
import IssueList from "./components/customer/issuesList";
import OffersList from "./components/customer/listMyOffers";
import FindWorker from "./components/customer/find-worker";
// Worker pages
import WorkerHome from "./components/worker/home";
import WorkerIssues from "./components/worker/issues";
import WorkerOffers from "./components/worker/offers";
import WorkerProfile from "./components/worker/profile";
import Help from "./components/worker/help";

// Admin pages
import AdminHome from "./components/admin/home";
// import AdminUsers from "./components/admin/users";
// import AdminIssues from "./components/admin/issues";
// import AdminSettings from "./components/admin/settings";

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
    if (userRole === "admin") return "/admin/home";
    return "/login"; // fallback
  };

  return (
    <Router>
      <Box sx={{ minHeight: "100vh" }}>
        <Routes>
          {/* Auth Routes */}
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

          {/* Customer Routes */}
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
          <Route
            path="/customer/issuesList"
            element={isAuthenticated ? <IssueList /> : <Navigate to="/login" />}
          />
          <Route
            path="/customer/listMyOffers"
            element={
              isAuthenticated ? <OffersList /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/customer/find-worker"
            element={
              isAuthenticated ? <FindWorker /> : <Navigate to="/login" />
            }
          />

          {/* Worker Routes */}
          <Route
            path="/worker/home"
            element={
              isAuthenticated ? <WorkerHome /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/worker/issues"
            element={
              isAuthenticated ? <WorkerIssues /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/worker/offers"
            element={
              isAuthenticated ? <WorkerOffers /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/worker/profile"
            element={
              isAuthenticated ? <WorkerProfile /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/worker/help"
            element={isAuthenticated ? <Help /> : <Navigate to="/login" />}
          />

          {/* Admin Routes */}
          <Route
            path="/admin/home"
            element={isAuthenticated ? <AdminHome /> : <Navigate to="/login" />}
          />
          {/* <Route path="/admin/users" element={isAuthenticated ? <AdminUsers /> : <Navigate to="/login" />} />
          <Route path="/admin/issues" element={isAuthenticated ? <AdminIssues /> : <Navigate to="/login" />} />
          <Route path="/admin/settings" element={isAuthenticated ? <AdminSettings /> : <Navigate to="/login" />} /> */}

          {/* Default Redirect */}
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
//updated path
