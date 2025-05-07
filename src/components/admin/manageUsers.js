import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSideBar from "./sideBar";
import "../../styles/admin/manageUsers.css";

const AdminManageUsers = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  // Fetch users on component load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8088/users");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:8088/users/${userId}`);
      setSuccessMsg("User deleted successfully.");
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  const deleteIssue = async (issueId) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;

    try {
      await axios.delete(`http://localhost:8088/issues/${issueId}`);
      setSuccessMsg("Issue deleted successfully.");
      // Optionally re-fetch users or issues if needed
    } catch (err) {
      setError("Failed to delete issue.");
    }
  };

  return (
    <div className="admin-users-container">
      <AdminSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <h2>Manage Users</h2>

      {error && <div className="error">{error}</div>}
      {successMsg && <div className="success">{successMsg}</div>}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((u) => u.role !== "admin")
              .map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => deleteUser(user._id)}>
                      Delete User
                    </button>
                    {/* Optional: if user has issueId */}
                    {user.issueId && (
                      <button onClick={() => deleteIssue(user.issueId)}>
                        Delete Issue
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminManageUsers;
