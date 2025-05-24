import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/reset-password.css";

const ResetPassword = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get("code");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [valid, setValid] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getPasswordStrength = (password) => {
    if (
      password.length >= 10 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      return "strong";
    } else if (
      password.length >= 8 &&
      /\d/.test(password) &&
      /[A-Z]/.test(password)
    ) {
      return "good";
    } else if (password.length >= 6) {
      return "fair";
    } else {
      return "weak";
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8088/users/requestUpdatePassword/${username}`, {
        params: { code },
      })
      .then(() => setValid(true))
      .catch(() => setMessage("❌ Invalid or expired code."));
  }, [username, code]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.put("http://localhost:8088/users/update-password", {
        username,
        code,
        newPassword,
      });
      setMessage("✅ Password updated successfully. You can now log in.");
      setTimeout(() => navigate("/login"), 2500);
    } catch {
      setError("❌ Failed to update password.");
    }
  };

  if (!valid && !message) return <p>Verifying reset code...</p>;

  return (
    <div className="reset-password-page">
      <div className="reset-box">
        <h2>Reset Password</h2>
        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        {valid && (
          <form onSubmit={handleReset}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {/* Strength Meter */}
            <div className="strength-meter">
              <div
                className={`strength-bar ${getPasswordStrength(newPassword)}`}
              ></div>
            </div>
            <button type="submit">Update Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
