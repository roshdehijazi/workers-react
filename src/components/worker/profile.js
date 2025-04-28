import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import WorkerSideBar from "./sideBar"; // 👈 Your new Worker Sidebar
import "../../styles/worker/profile.css"; // 👈 We will create beautiful CSS too
import axios from "axios";

const WorkerProfile = () => {
  const [workerData, setWorkerData] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setWorkerData(user);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleOpenUpdate = () => {
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdateDialog(false);
  };

  const handleChange = (e) => {
    setWorkerData({ ...workerData, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8088/users/${workerData.id}`,
        workerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem("user", JSON.stringify(workerData));
      setOpenUpdateDialog(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update worker:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8088/users/${workerData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  if (!workerData) return <div>Loading...</div>;

  return (
    <div className="worker-dashboard">
      <WorkerSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Box
        className={`profile-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <Box className="profile-card">
          {/* Worker Avatar */}
          <Box className="profile-avatar">
            🛠️ {/* (later you can replace with real image if you want) */}
          </Box>

          <Typography className="profile-title">Worker Profile</Typography>

          <Box className="profile-info">
            <p>
              <strong>Username:</strong> {workerData.username}
            </p>
            <p>
              <strong>Email:</strong> {workerData.email}
            </p>
            <p>
              <strong>Role:</strong> {workerData.role}
            </p>
          </Box>

          <Box className="profile-buttons">
            <Button
              variant="contained"
              className="update-button"
              onClick={handleOpenUpdate}
            >
              Update Info
            </Button>

            <Button
              variant="contained"
              className="delete-button"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </Box>
        </Box>

        {/* Update Dialog */}
        <Dialog open={openUpdateDialog} onClose={handleCloseUpdate}>
          <DialogTitle>Update Your Info</DialogTitle>
          <DialogContent>
            <form onSubmit={handleUpdateSubmit}>
              <TextField
                margin="dense"
                id="username"
                label="Username"
                type="text"
                name="username"
                fullWidth
                value={workerData.username}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                id="email"
                label="Email"
                type="email"
                name="email"
                fullWidth
                value={workerData.email}
                onChange={handleChange}
              />
              {/* Update Role (Optional if you want) */}
              <FormControl fullWidth margin="dense">
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={workerData.role}
                  label="Role"
                  onChange={handleChange}
                >
                  <MenuItem value="Worker">Worker</MenuItem>
                  <MenuItem value="Customer">Customer</MenuItem>
                  {/* Admin not allowed from here! */}
                </Select>
              </FormControl>

              <DialogActions>
                <Button onClick={handleCloseUpdate}>Cancel</Button>
                <Button
                  type="submit"
                  sx={{ backgroundColor: "#333333", color: "#ffffff" }}
                >
                  Save Changes
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </div>
  );
};

export default WorkerProfile;
