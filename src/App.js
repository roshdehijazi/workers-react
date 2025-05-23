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
import CustomerChats from "./components/customer/customerChats";
import CustomerChatRoom from "./components/customer/customerChatRoom";
import CustomerNotifications from "./components/customer/notifications";

import IssueList from "./components/customer/issuesList";
import IssueOffers from "./components/customer/issueOffers";
import FindWorker from "./components/customer/find-worker";
// Worker pages
import WorkerHome from "./components/worker/home";
import WorkerIssues from "./components/worker/issues";
import WorkerOffers from "./components/worker/offers";
import WorkerChats from "./components/worker/workerChats";
import WorkerChatRoom from "./components/worker/workerChatRoom";
import WorkerProfile from "./components/worker/profile";
import Help from "./components/worker/help";

// Admin pages
import AdminHome from "./components/admin/home";
import AdminUsers from "./components/admin/manageUsers";
import AdminIssues from "./components/admin/manageIssues";
import AdminConversation from "./components/admin/conversation";
import AdminSettings from "./components/admin/settings";

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
    if (userRole === "CUSTOMER") return "/customer/home";
    if (userRole === "WORKER") return "/worker/home";
    if (userRole === "ADMIN") return "/admin/home";
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
            path="/customer/customer-chats"
            element={
              isAuthenticated ? <CustomerChats /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/customer-chat/:roomId"
            element={
              isAuthenticated ? <CustomerChatRoom /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/customer/notifications"
            element={
              isAuthenticated ? (
                <CustomerNotifications />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/customer/issuesList"
            element={isAuthenticated ? <IssueList /> : <Navigate to="/login" />}
          />
          <Route
            path="/issueOffers/:issueId"
            element={
              isAuthenticated ? <IssueOffers /> : <Navigate to="/login" />
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
            path="/worker/chat"
            element={
              isAuthenticated ? <WorkerChats /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/worker/chatRoom/:roomId"
            element={
              isAuthenticated ? <WorkerChatRoom /> : <Navigate to="/login" />
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
          <Route
            path="/admin/manageUsers"
            element={
              isAuthenticated ? <AdminUsers /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/manageIssues"
            element={
              isAuthenticated ? <AdminIssues /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/conversation"
            element={
              isAuthenticated ? <AdminConversation /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/settings"
            element={
              isAuthenticated ? <AdminSettings /> : <Navigate to="/login" />
            }
          />

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
