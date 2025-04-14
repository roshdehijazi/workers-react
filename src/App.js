import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { Box } from '@mui/material';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Box sx={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login setAuth={setIsAuthenticated} />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register setAuth={setIsAuthenticated} />
          } />
          <Route path="/dashboard" element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
          } />
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          } />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;