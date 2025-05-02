import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import SideBar from "./sideBar"; // or your actual sidebar component path
import "../../styles/worker/help.css"; // optional: create matching CSS if needed

const Help = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSend = () => {
    if (message.trim() === "") return;
    // Simulate sending message to admin
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage("");
    }, 2000);
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="worker-dashboard">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <Box
        className={`help-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
        sx={{ padding: 4 }}
      >
        <Paper
          elevation={3}
          sx={{ padding: 4, maxWidth: 600, margin: "0 auto" }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
            Need Help?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            If you're having any issues, you can send a message to the admin
            below.
          </Typography>

          <TextField
            label="Write your message"
            multiline
            rows={5}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
          />

          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSend}
              disabled={submitted || message.trim() === ""}
            >
              {submitted ? "Message Sent" : "Send to Admin"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default Help;
