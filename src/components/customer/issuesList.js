import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "./sideBar";
import "../../styles/customer/issuesList.css";
import { useNavigate } from "react-router-dom";

const CATEGORY_OPTIONS = ["ELECTRICAL", "PLUMBING", "FURNITURE", "PAINTING"];

const SimpleIssueList = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editIssue, setEditIssue] = useState(null);
  const [deleteIssueId, setDeleteIssueId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedImageList, setSelectedImageList] = useState([]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user.id;

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8088/issues/customer/${username}`
        );
        setIssues(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Failed to load issues");
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchIssues();
  }, [username]);

  const handleDelete = async () => {
    await axios.delete(`http://localhost:8088/issues/${deleteIssueId}`);
    setIssues((prev) => prev.filter((issue) => issue.id !== deleteIssueId));
    setDeleteDialogOpen(false);
  };

  const handleOpenEditDialog = (issue) => {
    setEditIssue(issue);
    setEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteIssueId(id);
    setDeleteDialogOpen(true);
  };

  const handleEditChange = (e) => {
    setEditIssue({ ...editIssue, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    const { id, title, description, category } = editIssue;
    await axios.put(`http://localhost:8088/issues/${id}/updateTitle`, {
      title,
    });
    await axios.put(`http://localhost:8088/issues/${id}/updateDescription`, {
      description,
    });
    await axios.put(`http://localhost:8088/issues/${id}/updateCategory`, {
      category,
    });
    setEditDialogOpen(false);
    window.location.reload();
  };

  return (
    <div className="customer-dashboard">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`home-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <h2 className="issues-title">Reported Issues</h2>

        {loading && <div className="loading-box">Loading...</div>}

        {error && (
          <div className="error-box">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
            {issues.length === 0 ? (
              <p className="no-issues-message">
                You haven’t reported any issues yet.
              </p>
            ) : (
              <div className="issues-grid">
                {issues.map((issue) => (
                  <div className="issue-card" key={issue.id}>
                    {issue.images && issue.images.length > 0 && (
                      <div className="issue-images-grid">
                        {issue.images.map((img, index) => (
                          <img
                            key={index}
                            className="issue-image"
                            src={img}
                            alt={`issue-${index}`}
                            onClick={() => {
                              setSelectedImageList(issue.images);
                              setSelectedImageIndex(index);
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <div className="issue-content">
                      <h3>{issue.title}</h3>
                      <p>{issue.description}</p>

                      <div className="chip-container">
                        <span
                          className={`chip ${issue.category.toLowerCase()}`}
                        >
                          {issue.category}
                        </span>
                        <span
                          className={`chip ${
                            issue.isFinished ? "done" : "pending"
                          }`}
                        >
                          {issue.isFinished ? "Completed" : "Pending"}
                        </span>
                      </div>

                      <p className="issue-date">
                        {new Date(issue.startDate).toLocaleDateString()}
                      </p>
                      <div className="issue-views">
                        <span role="img" aria-label="views">
                          👁️
                        </span>{" "}
                        {issue.countViewrs || 0} views
                      </div>
                    </div>

                    <div className="issue-actions">
                      <button onClick={() => handleOpenEditDialog(issue)}>
                        Edit
                      </button>
                      <button onClick={() => handleOpenDeleteDialog(issue.id)}>
                        Delete
                      </button>
                    </div>
                    <button
                      className="list-offers-btn"
                      onClick={() => navigate(`/issueOffers/${issue.id}`)}
                    >
                      View Offers
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {editDialogOpen && (
        <div className="overlay">
          <div className="dialog">
            <h3>Edit Issue</h3>
            <input
              type="text"
              name="title"
              value={editIssue.title}
              onChange={handleEditChange}
              placeholder="Title"
            />
            <textarea
              name="description"
              value={editIssue.description}
              onChange={handleEditChange}
              placeholder="Description"
            />
            <select
              name="category"
              value={editIssue.category}
              onChange={handleEditChange}
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <div className="dialog-buttons">
              <button onClick={() => setEditDialogOpen(false)}>Cancel</button>
              <button onClick={handleEditSubmit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {deleteDialogOpen && (
        <div className="overlay">
          <div className="dialog">
            <h3>Are you sure you want to delete this issue?</h3>
            <div className="dialog-buttons">
              <button onClick={() => setDeleteDialogOpen(false)}>Cancel</button>
              <button onClick={handleDelete} className="danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedImageIndex !== null && (
        <div
          className="image-modal-overlay"
          onClick={() => setSelectedImageIndex(null)}
        >
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-nav left"
              onClick={() =>
                setSelectedImageIndex(
                  (prev) =>
                    (prev - 1 + selectedImageList.length) %
                    selectedImageList.length
                )
              }
            >
              ◀
            </button>

            <img
              src={selectedImageList[selectedImageIndex]}
              alt="Enlarged"
              className="modal-image"
            />

            <button
              className="modal-nav right"
              onClick={() =>
                setSelectedImageIndex(
                  (prev) => (prev + 1) % selectedImageList.length
                )
              }
            >
              ▶
            </button>

            <button
              className="close-modal"
              onClick={() => setSelectedImageIndex(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleIssueList;
