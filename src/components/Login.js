import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import "../styles/Login&Register.css";

const Login = ({ setAuth, setUserRole }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.post(
          "http://localhost:8088/auth/login",
          values
        );
        const user = response.data.user;

        console.log("User object:", user);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(user));

        setAuth(true);
        setUserRole(user.role);

        // Redirect based on user role
        if (user.role === "Customer") {
          navigate("/customer/index");
        } else if (user.role === "Worker") {
          navigate("/worker/index");
        } else if (user.role === "Admin") {
          navigate("/admin/index");
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box className="login-box">
      <Typography
        sx={{
          color: "#333333",
          textAlign: "center",
          fontSize: "32px",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="username"
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
          margin="normal"
        />

        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
        />

        <Button
          fullWidth
          type="submit"
          disabled={loading}
          sx={{
            mt: 2,
            backgroundColor: "#333333",
            color: "#ffffff",
            fontWeight: "bold",
            borderRadius: "8px",
            py: 1.5,
            "&:hover": {
              backgroundColor: "#555555",
            },
            "&:active": {
              transform: "scale(0.98)",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#ffffff" }} />
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <Typography
        sx={{ mt: 2, textAlign: "center", color: "#333333", fontSize: "14px" }}
      >
        Don't have an account?{" "}
        <a
          href="/register"
          style={{
            color: "#333333",
            fontWeight: "bold",
            textDecoration: "underline",
          }}
        >
          Register here
        </a>
      </Typography>
    </Box>
  );
};

export default Login;
