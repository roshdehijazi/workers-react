import React, { useState, useEffect } from 'react';
import { 
  Button, TextField, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBar from './sideBar';
import '../../styles/customer/profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData(user);
    }
  }, []);

  const handleOpenUpdate = () => {
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdateDialog(false);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8088/users/${userData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8088/users/${userData.id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      localStorage.setItem('user', JSON.stringify(userData));
      setOpenUpdateDialog(false);
      window.location.reload();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleRequestChangePassword = () => {
    // 🚀 You can later redirect to /change-password page or open a dialog
    alert('Password change request sent! (build real feature later)');
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="customer-dashboard">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Box className={`profile-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Box className="profile-card">
          <Typography className="profile-title">
            Customer Profile
          </Typography>

          <Box className="profile-info">
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Role:</strong> {userData.role}</p>
          </Box>

          <Box className="profile-buttons">
            <Button 
              variant="contained" 
              sx={{ backgroundColor: '#333333', color: '#ffffff' }}
              onClick={handleOpenUpdate}
            >
              Update
            </Button>
            <Button 
              variant="contained" 
              sx={{ backgroundColor: '#cc0000', color: '#ffffff' }}
              onClick={handleDelete}
            >
              Delete Account
            </Button>
          </Box>

          {/* New button to Request Password Change */}
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="outlined" 
              sx={{ borderColor: '#333333', color: '#333333', fontWeight: 'bold' }}
              onClick={handleRequestChangePassword}
            >
              Request Password Change
            </Button>
          </Box>
        </Box>

        {/* Update Dialog */}
        <Dialog open={openUpdateDialog} onClose={handleCloseUpdate}>
          <DialogTitle>Update Your Profile</DialogTitle>
          <DialogContent>
            <form onSubmit={handleUpdateSubmit}>
              <TextField
                margin="dense"
                id="username"
                label="Username"
                type="text"
                name="username"
                fullWidth
                value={userData.username}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                id="email"
                label="Email"
                type="email"
                name="email"
                fullWidth
                value={userData.email}
                onChange={handleChange}
              />
              {/* NEW: Update Role */}
              <FormControl fullWidth margin="dense">
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={userData.role}
                  label="Role"
                  onChange={handleChange}
                >
                  <MenuItem value="Customer">Customer</MenuItem>
                  <MenuItem value="Worker">Worker</MenuItem>
                  {/* Add other roles if you have */}
                </Select>
              </FormControl>

              <DialogActions>
                <Button onClick={handleCloseUpdate}>Cancel</Button>
                <Button type="submit" sx={{ backgroundColor: '#333333', color: '#ffffff' }}>
                  Save
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </div>
  );
};

export default Profile;
