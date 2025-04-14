import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
   
    navigate('/login');
    window.location.reload();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.username}!
      </Typography>
      <Typography variant="body1" gutterBottom>
        You are logged in as a {user?.role}.
      </Typography>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleLogout}
        sx={{ mt: 2 }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Dashboard;