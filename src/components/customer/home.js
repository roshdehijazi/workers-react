import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./sideBar";
import "../../styles/customer/home.css";
import photoHome from "../../assets/customer/home/photo-home.png";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [issueData, setIssueData] = useState({
    title: "",
    description: "",
    category: "",
    image: [],
  });

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setIssueData({
      title: "",
      description: "",
      category: "",
      image: null,
    });
  };

  const handleChange = (e) => {
    setIssueData({ ...issueData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setIssueData((prev) => ({
      ...prev,
      image: [...prev.image, ...newFiles],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", issueData.title);
      formData.append("description", issueData.description);
      formData.append("category", issueData.category);
      const user = JSON.parse(localStorage.getItem("user"));
      formData.append("customerId", user.id);
      formData.append("startDate", new Date().toISOString());

      if (issueData.image && issueData.image.length > 0) {
        Array.from(issueData.image).forEach((file) => {
          formData.append("files", file); // important: keep same key "files"
        });
      }

      await axios.post("http://localhost:8088/issues", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Issue submitted successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-dashboard">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`home-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        {successMessage && (
          <div className="notification">
            <span>{successMessage}</span>
            <button className="close-btn" onClick={() => setSuccessMessage("")}>
              ×
            </button>
          </div>
        )}

        <div className="home-content">
          <div className="home-main-card fade-in-delay">
            <div className="left-section-image">
              <img src={photoHome} alt="Welcome" className="welcome-image" />
            </div>
            <div className="right-section">
              <div className="action-title">Quick Actions</div>
              <div className="home-buttons">
                <button
                  style={{ backgroundColor: "#333", color: "#fff" }}
                  onClick={handleClickOpen}
                >
                  Put Issue
                </button>
                <button onClick={() => navigate("../customer/issuesList")}>
                  List My Issues
                </button>
              </div>
            </div>
          </div>
        </div>

        {openDialog && (
          <div className="dialog-overlay">
            <div className="dialog">
              <div className="dialog-header">
                <h3>Submit Your Issue</h3>
                <button onClick={handleClose}>×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="title"
                  placeholder="Issue Title"
                  value={issueData.title}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={issueData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                />
                <select
                  name="category"
                  value={issueData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="ELECTRICAL">Electric</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Painting">Painting</option>
                  <option value="Other">Other</option>
                </select>
                <label className="custom-file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageChange(e)}
                  />
                  Choose Files
                </label>

                {issueData.image && issueData.image.length > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    <strong>Selected Images:</strong>
                    <ul style={{ padding: 0 }}>
                      {issueData.image.map((file, idx) => (
                        <li
                          key={idx}
                          style={{
                            listStyle: "none",
                            marginBottom: "10px",
                            position: "relative",
                          }}
                        >
                          <button
                            onClick={() => {
                              const updated = [...issueData.image];
                              updated.splice(idx, 1);
                              setIssueData((prev) => ({
                                ...prev,
                                image: updated,
                              }));
                            }}
                            style={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              background: "#f44336",
                              color: "#fff",
                              border: "none",
                              borderRadius: "50%",
                              width: "20px",
                              height: "20px",
                              cursor: "pointer",
                            }}
                          >
                            ×
                          </button>
                          <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              border: "1px solid #ccc",
                            }}
                          />
                          <p style={{ fontSize: "12px", marginTop: "4px" }}>
                            {file.name}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {error && <p style={{ color: "red" }}>{error}</p>}
                <div className="dialog-actions">
                  <button type="button" onClick={handleClose}>
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Issue"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
