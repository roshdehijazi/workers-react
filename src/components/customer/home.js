import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SideBar from "./sideBar";
import "../../styles/customer/home.css";
import photoHome from '../../assets/customer/home/photo-home.png';
import axios from "axios";
//update home.js test test .. 
const Input = styled("input")({
  display: "none",
});

const Home = () => {
   const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [issueData, setIssueData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
  });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
    setIssueData({ ...issueData, image: e.target.files[0] });
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

      if (issueData.image) {
        formData.append("image", issueData.image);
      }
  
      const response = await axios.post(
        "http://localhost:8088/issues",
        issueData
      );
  
      console.log("Issue submitted successfully:", response.data);
      alert("Issue submitted successfully!");
      handleClose(); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit issue");
      console.error("Error submitting issue:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleListIssues = () => {
    
    navigate("../customer/issuesList");
  };

  const handleListOffers = () => {
    alert("Go to My Offers Page (later)");
  };

  return (
    <div className="customer-dashboard">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <Box
        className={`home-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <Box className="home-content">
  <Box className="home-main-card fade-in-delay">
    {/* Left - Image */}
    <Box className="left-section-image">
    <img src={photoHome} alt="Welcome" className="welcome-image" />
    </Box>

    {/* Right - Buttons */}
    <Box className="right-section">
      <Typography className="action-title">Quick Actions</Typography>

      <Box className="home-buttons">
        <Button
          variant="contained"
          onClick={handleClickOpen}
          sx={{
            backgroundColor: "#333333",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: "18px",
            borderRadius: "10px",
            '&:hover': {
              backgroundColor: "#555555",
            }
          }}
        >
          Put Issue
        </Button>

        <Button
          variant="outlined"
          onClick={handleListIssues}
          sx={{
            color: "#333333",
            borderColor: "#333333",
            fontWeight: "bold",
            fontSize: "18px",
            borderRadius: "10px",
            '&:hover': {
              backgroundColor: "#333333",
              color: "#ffffff",
            }
          }}
        >
          List My Issues
        </Button>

        <Button
          variant="outlined"
          onClick={handleListOffers}
          sx={{
            color: "#333333",
            borderColor: "#333333",
            fontWeight: "bold",
            fontSize: "18px",
            borderRadius: "10px",
            '&:hover': {
              backgroundColor: "#333333",
              color: "#ffffff",
            }
          }}
        >
          List My Offers
        </Button>
      </Box>
    </Box>
  </Box>
</Box>


        {/* Dialog for Putting Issue */}
        <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Submit Your Issue</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Issue Title"
                name="title"
                value={issueData.title}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                name="description"
                value={issueData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={issueData.category}
                  onChange={handleChange}
                  label="Category"
                  required
                >
                  <MenuItem value="ELECTRICAL">Electric</MenuItem>
                  <MenuItem value="Plumbing">Plumbing</MenuItem>
                  <MenuItem value="Furniture">Furniture</MenuItem>
                  <MenuItem value="Painting">Painting</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 2 }}>
                <label htmlFor="upload-image">
                  <Input
                    accept="image/*"
                    id="upload-image"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <Button variant="outlined" component="span">
                    Upload Image
                  </Button>
                </label>
                {issueData.image && (
                  <Typography sx={{ mt: 1, fontSize: "14px" }}>
                    Selected: {issueData.image.name}
                  </Typography>
                )}
              </Box>

              <DialogActions sx={{ mt: 3 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ backgroundColor: "#333333", color: "#ffffff" }}
                >
                  Submit Issue
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

      </Box>
    </div>
  );
};

export default Home;
