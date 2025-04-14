import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Link, 
  Alert,
  CircularProgress
} from '@mui/material';
import '../styles/Login&Register.css';
const Login = ({ setAuth }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.post('http://localhost:8088/auth/login', values);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setAuth(true);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box sx={{ 
      maxWidth: 400, 
      mx: 'auto', 
      mt: 8, 
      p: 4,
      backgroundColor: 'background.paper',
      borderRadius: 2,
      boxShadow: 3,
      '& .MuiTextField-root': {
        mb: 2
      },
      '& .MuiButton-root': {
        mt: 3,
        py: 1.5
      }
    }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          id="username"
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />

        <TextField
          fullWidth
          margin="normal"
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
      </form>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Don't have an account? <Link href="/register">Register here</Link>
      </Typography>
    </Box>
  );
};

export default Login;