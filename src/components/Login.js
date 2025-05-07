import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import loginImage from "../assets/main/login/login-image.png";

const Login = ({ setAuth, setUserRole }) => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const err = {};
    if (!values.username.trim()) err.username = "Username is required";
    if (!values.password.trim()) err.password = "Password is required";
    return err;
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8088/auth/login",
        values
      );
      const user = response.data.user;

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      setAuth(true);
      setUserRole(user.role);

      if (user.role === "Customer") navigate("/customer/home");
      else if (user.role === "Worker") navigate("/worker/home");
      else if (user.role === "admin") navigate("/admin/home");
      else navigate("/login");
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-image-side">
        <img src={loginImage} alt="Welcome" />
      </div>

      <div className="login-form-side">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          {serverError && <div className="error">{serverError}</div>}

          <label>Username</label>
          <input
            type="text"
            name="username"
            value={values.username}
            onChange={handleChange}
          />
          {errors.username && <div className="error">{errors.username}</div>}

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <div className="error">{errors.password}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="register-link">
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
