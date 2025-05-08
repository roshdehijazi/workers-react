import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSideBar from "./sideBar";
import styles from "../../styles/admin/manageIssues.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminManageIssues = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [issues, setIssues] = useState([]);
  const [editingIssue, setEditingIssue] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await axios.get("http://localhost:8088/issues/newer");
      setIssues(res.data);
    } catch {
      toast.error("Failed to fetch issues");
    }
  };

  const startEdit = (issue) => {
    setEditingIssue(issue);
    setFormData({
      title: issue.title,
      description: issue.description,
      category: issue.category,
    });
  };

  const cancelEdit = () => setEditingIssue(null);

  const handleUpdate = async () => {
    const id = editingIssue?.id || editingIssue?._id;
    if (!id) {
      toast.error("No issue selected.");
      return;
    }

    try {
      await axios.put(`http://localhost:8088/issues/${id}/updateTitle`, {
        title: formData.title,
      });
      await axios.put(`http://localhost:8088/issues/${id}/updateDescription`, {
        description: formData.description,
      });
      await axios.put(`http://localhost:8088/issues/${id}/updateCategory`, {
        category: formData.category,
      });

      setEditingIssue(null);
      toast.success("Issue updated successfully", { autoClose: 2000 });
      fetchIssues();
    } catch {
      toast.error("Failed to update issue");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this issue?")) return;

    try {
      await axios.delete(`http://localhost:8088/issues/${id}`);
      setIssues(issues.filter((i) => i.id !== id));
      toast.success("Issue deleted successfully", { autoClose: 2000 });
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className={styles.wrapper}>
      <AdminSideBar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : ""
        }`}
      >
        <h2>Manage Issues</h2>
        <table className={styles.table}>
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
              <tr key={issue.id || issue._id}>
                <td>{issue.title}</td>
                <td>{issue.description}</td>
                <td>{issue.category}</td>
                <td>
                  <button
                    className={styles.editBtn}
                    onClick={() => startEdit(issue)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(issue.id || issue._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingIssue && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Edit Issue</h3>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="FURNITURE">FURNITURE</option>
                <option value="ELECTRICAL">ELECTRICAL</option>
                <option value="PLUMBING">PLUMBING</option>
                <option value="PAINTING">PAINTING</option>
                <option value="OTHER">OTHER</option>
              </select>
              <div className={styles.modalActions}>
                <button className={styles.updateBtn} onClick={handleUpdate}>
                  Update
                </button>
                <button className={styles.cancelBtn} onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default AdminManageIssues;
