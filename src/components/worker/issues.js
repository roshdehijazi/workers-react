import React, { useState, useEffect } from "react";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Card, CardContent, CardMedia } from "@mui/material";
import WorkerSideBar from "./sideBar";
import "../../styles/worker/issues.css";

const AvailableIssues = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [issues, setIssues] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // 🛠️ MOCK Data - later replace with API call
    const mockIssues = [
      {
        id: 1,
        title: "Fix Living Room Light",
        description: "Need an electrician to fix light problem.",
        category: "Electric",
        image: null
      },
      {
        id: 2,
        title: "Repair Kitchen Sink",
        description: "Leakage issue under sink.",
        category: "Plumbing",
        image: null
      },
      {
        id: 3,
        title: "Assemble Bed",
        description: "Need help assembling new furniture.",
        category: "Furniture",
        image: null
      }
    ];

    setIssues(mockIssues);
  }, []);

  const handleFilterChange = (event) => {
    setFilteredCategory(event.target.value);
  };

  const filteredIssues = filteredCategory
    ? issues.filter((issue) => issue.category === filteredCategory)
    : issues;

  return (
    <div className="worker-dashboard">
      <WorkerSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Box className={`issues-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <Typography variant="h4" className="page-title">Available Issues</Typography>

        <FormControl fullWidth className="filter-select">
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={filteredCategory}
            label="Filter by Category"
            onChange={handleFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Electric">Electric</MenuItem>
            <MenuItem value="Plumbing">Plumbing</MenuItem>
            <MenuItem value="Furniture">Furniture</MenuItem>
            <MenuItem value="Painting">Painting</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        <Box className="issues-list">
          {filteredIssues.map((issue) => (
            <Card key={issue.id} className="issue-card">
              {issue.image && (
                <CardMedia
                  component="img"
                  height="140"
                  image={issue.image}
                  alt={issue.title}
                  className="issue-image"
                />
              )}
              <CardContent>
                <Typography variant="h6" className="issue-title">{issue.title}</Typography>
                <Typography className="issue-description">{issue.description}</Typography>
                <Typography className="issue-category">Category: {issue.category}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default AvailableIssues;
