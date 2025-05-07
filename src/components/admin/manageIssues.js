import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSideBar from "./sideBar";
import "../../styles/admin/manageIssues.css";

const AdminManageIssues = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIssueId, setEditingIssueId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [newImageFile, setNewImageFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await axios.get("http://localhost:8088/issues");
      setIssues(response.data);
    } catch (err) {
      setError("Failed to fetch issues.");
    } finally {
      setLoading(false);
    }
  };

  const deleteIssue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;

    try {
      await axios.delete(`http://localhost:8088/issues/${id}`);
      setIssues(issues.filter((i) => i._id !== id));
      setSuccess("Issue deleted successfully.");
    } catch (err) {
      setError("Failed to delete issue.");
    }
  };

  const startEdit = (issue) => {
    setEditingIssueId(issue._id);
    setFormData({
      title: issue.title,
      description: issue.description,
      category: issue.category,
    });
    setNewImageFile(null);
    setSuccess("");
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImageFile(file);
  };

  const handleUpdateAll = async () => {
    if (!editingIssueId) return;

    try {
      await axios.put(
        `http://localhost:8088/issues/${editingIssueId}/updateTitle`,
        { title: formData.title }
      );
      await axios.put(
        `http://localhost:8088/issues/${editingIssueId}/updateDescription`,
        { description: formData.description }
      );
      await axios.put(
        `http://localhost:8088/issues/${editingIssueId}/updateCategory`,
        { category: formData.category }
      );

      setSuccess("Issue updated successfully.");
      setEditingIssueId(null);
      fetchIssues();
    } catch (err) {
      setError("Failed to update issue.");
    }
  };

  return (
    <div
      className={`admin-issues-container ${
        isSidebarOpen ? "sidebar-open" : ""
      }`}
    >
      <AdminSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="admin-issues-content">
        <h2>Manage Issues</h2>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {loading ? (
          <p>Loading issues...</p>
        ) : (
          <table className="issue-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue._id}>
                  <td>
                    {editingIssueId === issue._id ? (
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                      />
                    ) : (
                      issue.title
                    )}
                  </td>
                  <td>
                    {editingIssueId === issue._id ? (
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    ) : (
                      issue.description
                    )}
                  </td>
                  <td>
                    {editingIssueId === issue._id ? (
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="FURNITURE">FURNITURE</option>
                        <option value="ELECTRIC">ELECTRIC</option>
                        <option value="PLUMBING">PLUMBING</option>
                        <option value="PAINTING">PAINTING</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    ) : (
                      issue.category
                    )}
                  </td>
                  <td>
                    {editingIssueId === issue._id ? (
                      <>
                        <button
                          onClick={handleUpdateAll}
                          className="update-btn"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setEditingIssueId(null)}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(issue)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteIssue(issue._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminManageIssues;
