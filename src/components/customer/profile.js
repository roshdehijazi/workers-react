import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "./sideBar";
import "../../styles/customer/profile.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData(user);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleOpenUpdate = () => setOpenUpdateDialog(true);
  const handleCloseUpdate = () => setOpenUpdateDialog(false);
  const handleOpenPasswordDialog = () => setPasswordDialogOpen(true);
  const handleClosePasswordDialog = () => setPasswordDialogOpen(false);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8088/users/${userData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      navigate("/login");
      window.location.reload();
    } catch (err) {
      toast.error("Failed to delete account.");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8088/users/${userData.id}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("user", JSON.stringify(userData));
      setOpenUpdateDialog(false);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8088/users/${userData.id}/password`,
        {
          oldPassword: currentPassword,
          newPassword: newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Password updated successfully.");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPasswordDialogOpen(false), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password.");
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="customer-dashboard">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Box
        className={`profile-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <Box className="profile-card">
          <Typography className="profile-title">Customer Profile</Typography>

          <Box className="profile-info">
            <p>
              <strong>Username:</strong> {userData.username}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Role:</strong> {userData.role}
            </p>
          </Box>

          <Box className="profile-buttons">
            <Button
              variant="contained"
              sx={{ backgroundColor: "#333333", color: "#ffffff" }}
              onClick={handleOpenUpdate}
            >
              Update
            </Button>
            <Button variant="outlined" onClick={handleOpenPasswordDialog}>
              Change Password
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#cc0000", color: "#ffffff" }}
              onClick={handleDelete}
            >
              Delete Account
            </Button>
          </Box>
        </Box>

        {/* Update Profile Dialog */}
        <Dialog open={openUpdateDialog} onClose={handleCloseUpdate}>
          <DialogTitle>Update Your Profile</DialogTitle>
          <DialogContent>
            <form onSubmit={handleUpdateSubmit}>
              <TextField
                margin="dense"
                label="Username"
                type="text"
                name="username"
                fullWidth
                value={userData.username}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                name="email"
                fullWidth
                value={userData.email}
                onChange={handleChange}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="Customer">Customer</MenuItem>
                  <MenuItem value="Worker">Worker</MenuItem>
                </Select>
              </FormControl>
              <DialogActions>
                <Button onClick={handleCloseUpdate}>Cancel</Button>
                <Button
                  type="submit"
                  sx={{ backgroundColor: "#333", color: "#fff" }}
                >
                  Save
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        {/* Password Dialog */}
        <Dialog open={passwordDialogOpen} onClose={handleClosePasswordDialog}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Current Password"
              type="password"
              fullWidth
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="New Password"
              type="password"
              fullWidth
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="Confirm New Password"
              type="password"
              fullWidth
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePasswordDialog}>Cancel</Button>
            <Button
              onClick={handlePasswordChange}
              sx={{ backgroundColor: "#333", color: "#fff" }}
            >
              Change Password
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer position="top-right" autoClose={3000} />
      </Box>
    </div>
  );
};

export default Profile;
