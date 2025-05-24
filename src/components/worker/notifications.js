import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/customer/notifications.css";
import SideBar from "./sideBar";

const Notifications = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8088/Notifications/${user.id}`
        );
        setNotifications(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user.id]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8088/Notifications/markAsRead/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  return (
    <div className="customer-dashboard">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`customer-notifications-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <h2 className="notifications-title">My Notifications</h2>
        {loading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p>No notifications found</p>
        ) : (
          <ul className="notifications-list">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`notification-item ${n.read ? "read" : "unread"}`}
                onClick={() => !n.read && markAsRead(n.id)}
              >
                <div className="notification-content">
                  <span className="notification-message">{n.message}</span>
                  {n.issueId && (
                    <span
                      className="issue-title-link"
                      onClick={() =>
                        (window.location.href = `/customer/issue/${n.issueId}`)
                      }
                      style={{
                        color: "#007bff",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      View Issue
                    </span>
                  )}
                </div>

                {!n.read && <span className="badge">New</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
