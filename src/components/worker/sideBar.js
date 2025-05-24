import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaWrench,
  FaBell,
  FaCog,
  FaFolderPlus,
  FaQuestionCircle,
  FaComment,
} from "react-icons/fa";
import { Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../styles/worker/sideBar.css";

const WorkerSideBar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (location.pathname.startsWith("/worker/home")) setActiveItem("Home");
    else if (location.pathname.startsWith("/worker/issues"))
      setActiveItem("Available Issues");
    else if (location.pathname.startsWith("/worker/offers"))
      setActiveItem("My Offers");
    else if (location.pathname.startsWith("/worker/profile"))
      setActiveItem("Profile");
    else if (location.pathname.startsWith("/worker/chat"))
      setActiveItem("My Chats");
    else if (location.pathname.startsWith("/worker/notifications"))
      setActiveItem("Notifications");
  }, [location.pathname]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchUnread = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8088/Notifications/getCountUnRead/${user.id}`
        );
        setUnreadCount(res.data);
      } catch (err) {
        console.error("Failed to load unread notifications");
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/worker/home" },
    { name: "Available Issues", icon: <FaWrench />, path: "/worker/issues" },
    { name: "My Offers", icon: <FaFolderPlus />, path: "/worker/offers" },
    { name: "My Chats", icon: <FaComment />, path: "/worker/chat" },
    { name: "Notifications", icon: <FaBell />, path: "/worker/notifications" },
    { name: "Profile", icon: <FaCog />, path: "/worker/profile" },
    { name: "Help", icon: <FaQuestionCircle />, path: "/worker/help" },
  ];

  if (!user) return <div className="sidebar-loading">Loading...</div>;

  return (
    <div className={`sidebar worker-sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <div className="hamburger-icon">
          <div />
          <div />
          <div />
        </div>
      </button>

      <div className="sidebar-content">
        <h2>{isOpen ? `Welcome, ${user?.username}` : ""}</h2>
        <h2>{isOpen ? "Menu" : ""}</h2>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={activeItem === item.name ? "active" : ""}
              onClick={() => {
                setActiveItem(item.name);
                navigate(item.path);
              }}
            >
              <div className="menu-item-content">
                <span className="icon" style={{ position: "relative" }}>
                  {item.name === "Notifications" ? (
                    <>
                      <FaBell />
                      {unreadCount > 0 && <span className="red-dot" />}
                    </>
                  ) : (
                    item.icon
                  )}
                </span>
                {isOpen && <span className="text">{item.name}</span>}
              </div>
            </li>
          ))}
        </ul>

        {isOpen && (
          <Button fullWidth className="logout-button" onClick={handleLogout}>
            LogOut
          </Button>
        )}
      </div>
    </div>
  );
};

export default WorkerSideBar;
