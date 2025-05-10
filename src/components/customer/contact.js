import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SideBar from "./sideBar"; // ✅ Sidebar
import "../../styles/customer/contact.css"; // ✅ Correct CSS file

const Contact = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleStartConversation = () => {
    navigate("/customer/user-chat"); // or your actual chat route
  };

  return (
    <div className="customer-dashboard">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <Box
        className={`contact-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <Box className="contact-card">
          <Typography className="contact-title">Contact Us</Typography>

          <Typography className="contact-subtitle">
            Feel free to reach out to us anytime. We are here to help you!
          </Typography>

          {/* Contact Info */}
          <Box className="contact-info">
            <p>
              <strong>Email:</strong> support@yourwebsite.com
            </p>
            <p>
              <strong>Phone:</strong> +1 234 567 8901
            </p>
            <p>
              <strong>Address:</strong> 123 Main Street, Your City, Country
            </p>
          </Box>

          {/* Start Conversation Button */}
          <Box className="contact-buttons">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#333333",
                color: "#ffffff",
                fontWeight: "bold",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "16px",
                "&:hover": { backgroundColor: "#555555" },
              }}
              onClick={handleStartConversation}
            >
              Start Conversation with Admin
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Contact;
