import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Grid,
  Chip,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import SideBar from "./sideBar";
import "../../styles/customer/issuesList.css";

const SimpleIssueList = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8088/issues/${username}`
        );
        setIssues(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load issues");
        setLoading(false);
        console.error("Error fetching issues:", err);
      }
    };

    if (username) {
      fetchIssues();
    }
  }, [username]);

  const getCategoryColor = (category) => {
    switch (category) {
      case "ELECTRICAL":
        return "primary";
      case "PLUMBING":
        return "secondary";
      case "FURNITURE":
        return "success";
      case "PAINTING":
        return "warning";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box className="loading-box">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="error-box">
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <div className="customer-dashboard">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <Box
        className={`home-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <Typography variant="h4" className="issues-title">
          Reported Issues
        </Typography>

        {issues.length > 0 ? (
          <Grid container spacing={3} className="issues-grid">
            {issues.map((issue) => (
              <Grid item xs={12} sm={6} md={4} key={issue.id}>
                <Card className="issue-card">
                  {issue.picture && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={require(`../../assets/customer/issuePictures/${issue.picture}`)}
                      alt={issue.title}
                    />
                  )}
                  <CardContent>
                    <Typography gutterBottom variant="h6">
                      {issue.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {issue.description}
                    </Typography>
                    <Box className="chip-container">
                      <Chip
                        label={issue.category}
                        color={getCategoryColor(issue.category)}
                        size="small"
                      />
                      <Chip
                        label={issue.isFinished ? "Completed" : "Pending"}
                        color={issue.isFinished ? "success" : "warning"}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                  <Typography className="issue-date">
                    {new Date(issue.startDate).toLocaleDateString()}
                  </Typography>
                  <CardActions>
                    <Button size="small" color="primary">
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
            No issues found
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default SimpleIssueList;
