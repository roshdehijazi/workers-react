import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSideBar from "./sideBar";
import styles from "../../styles/admin/manageUsers.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminManageUsers = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

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

  const deleteUser = (userId) => {
    const toastId = toast.info(
      ({ closeToast }) => (
        <div>
          <strong>Are you sure you want to delete this user?</strong>
          <div className={styles["confirm-toast-buttons"]}>
            <button
              className={styles["confirm-button"]}
              onClick={async () => {
                try {
                  await axios.delete(`http://localhost:8088/users/${userId}`);
                  toast.dismiss(toastId);
                  toast.success("User deleted successfully.");
                  setUsers(users.filter((user) => user.id !== userId));
                } catch {
                  toast.dismiss(toastId);
                  toast.error("Failed to delete user.");
                }
              }}
            >
              Confirm
            </button>
            <button
              className={styles["cancel-button"]}
              onClick={() => toast.dismiss(toastId)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };

  const deleteIssue = async (issueId) => {
    try {
      await axios.delete(`http://localhost:8088/issues/${issueId}`);
      toast.success("Issue deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete issue.");
    }
  };

  return (
    <div className={styles["admin-users-container"]}>
      <AdminSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <h2>Manage Users</h2>

      {error && <div className={styles.error}>{error}</div>}
      {successMsg && <div className={styles.success}>{successMsg}</div>}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className={styles["user-table"]}>
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
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className={styles.button}
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete User
                    </button>
                    {user.issueId && (
                      <button
                        className={styles.button}
                        onClick={() => deleteIssue(user.issueId)}
                      >
                        Delete Issue
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminManageUsers;
