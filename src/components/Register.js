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
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';

const Register = ({ setAuth }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Customer'
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
      role: Yup.string()
        .oneOf(['Customer', 'Worker'], 'Invalid role')
        .required('Role is required')
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        await axios.post('http://localhost:8088/users', values);
        alert('Registration successful! Please login.');
        navigate('/login');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
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
        '& .MuiTextField-root, & .MuiFormControl-root': {
          mb: 2
        },
        '& .MuiButton-root': {
          mt: 3,
          py: 1.5
        }
      }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      
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
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
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

        <TextField
          fullWidth
          margin="normal"
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            id="role"
            name="role"
            label="Role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.role && Boolean(formik.errors.role)}
          >
            <MenuItem value="Customer">Customer</MenuItem>
            <MenuItem value="Worker">Worker</MenuItem>
          </Select>
        </FormControl>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
      </form>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account? <Link href="/login">Login here</Link>
      </Typography>
    </Box>
  );
};

export default Register;