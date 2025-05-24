import React, { useState } from "react";
import axios from "axios";
import image from "../assets/main/forgotPassowrd/main-image.png";
import "../styles/forgot-password.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8088/Email/send-reset", null, {
        params: { email },
      });
      setMessage("📧 Reset email sent successfully. Please check your inbox.");
    } catch (err) {
      setMessage("❌ Failed to send reset email.");
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-container">
        {/* Left side image */}
        <div className="forgot-image-section">
          <img src={image} alt="Reset Illustration" />
        </div>

        {/* Right side form */}
        <div className="forgot-form-section">
          <h2>Forgot Your Password?</h2>
          {message && (
            <p
              className={`message ${
                message.startsWith("❌") ? "error" : "success"
              }`}
            >
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Send Reset Email</button>
          </form>
          <p>
            Remembered? <a href="/login">Go back to login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
