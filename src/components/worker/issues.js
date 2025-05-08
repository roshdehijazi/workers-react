import React, { useState, useEffect } from "react";
import WorkerSideBar from "./sideBar";
import "../../styles/worker/issues.css";

const AvailableIssues = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [issues, setIssues] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("newer");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchIssues = async () => {
      let url = "";

      if (filteredCategory && sortOrder) {
        url = `http://localhost:8088/issues/category/${sortOrder}?category=${filteredCategory}`;
      } else if (filteredCategory && !sortOrder) {
        url = `http://localhost:8088/issues/category/${filteredCategory}`;
      } else {
        url = `http://localhost:8088/issues/${sortOrder}`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (Array.isArray(data)) {
          setIssues(data);
        } else {
          console.error("Unexpected response format:", data);
          setIssues([]); // fallback to empty
        }
      } catch (error) {
        console.error("Error fetching issues: ", error);
        setIssues([]);
      }
    };

    fetchIssues();
  }, [filteredCategory, sortOrder]);

  return (
    <div className="worker-dashboard">
      <WorkerSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`issues-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <h2 className="page-title">Available Issues</h2>

        <div className="filters">
          <div className="dropdown">
            <label>Category:</label>
            <select
              value={filteredCategory}
              onChange={(e) => setFilteredCategory(e.target.value)}
            >
              <option value="">All</option>
              <option value="Electrical">Electric</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Furniture">Furniture</option>
              <option value="Painting">Painting</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="dropdown">
            <label>Sort:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newer">Newest First</option>
              <option value="older">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="issues-list">
          {Array.isArray(issues) && issues.length === 0 ? (
            <p className="no-issues-message">No issues found.</p>
          ) : (
            Array.isArray(issues) &&
            issues.map((issue) => (
              <div className="issue-card" key={issue.id}>
                {issue.picture && (
                  <img
                    src={require(`../../assets/customer/issuePictures/${issue.picture}`)}
                    alt={issue.title}
                    className="issue-image"
                  />
                )}
                <div className="issue-content">
                  <h3>{issue.title}</h3>
                  <p>{issue.description}</p>
                  <span className="category-tag">{issue.category}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableIssues;
