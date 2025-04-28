import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom"; // 🛠 Import navigation hook
import WorkerSideBar from "./sideBar";
import "../../styles/worker/home.css";
import workerImage from "../../assets/worker/home/worker-home.png";

const WorkerHome = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate(); // 🛠 Initialize navigate function

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleGoToIssues = () => {
    navigate("/worker/issues");
  };

  const handleGoToOffers = () => {
    navigate("/worker/offers");
  };

  return (
    <div className="worker-dashboard">
      <WorkerSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Box className={`worker-home-content ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <Box className="home-main-card fade-in">
          {/* Left Image */}
          <Box className="card-left">
            <img src={workerImage} alt="Worker" className="worker-photo" />
          </Box>

          {/* Right Content */}
          <Box className="card-right">
            <h1>Welcome, Worker! 🔧</h1>
            <p>Ready to help customers today?</p>
            <Box className="home-buttons">
              <Button 
                variant="contained" 
                className="primary-button"
                onClick={handleGoToIssues} // 🛠 Navigate to Issues
              >
                Available Issues
              </Button>
              <Button 
                variant="outlined" 
                className="secondary-button"
                onClick={handleGoToOffers} // 🛠 Navigate to Offers
              >
                My Offers
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default WorkerHome;
