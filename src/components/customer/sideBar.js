import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaSearch,
  FaCog,
  FaQuestionCircle,
  FaBars,
  FaComment,
  FaBell,
} from "react-icons/fa";
import { Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../styles/customer/sideBar.css";

const SideBar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("Home");
  const [unreadCount, setUnreadCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/customer/home" },
    { name: "Find Worker", icon: <FaSearch />, path: "/customer/find-worker" },
    { name: "My Chats", icon: <FaComment />, path: "/customer/customer-chats" },
    { name: "Profile", icon: <FaCog />, path: "/customer/profile" },
    { name: "Contact", icon: <FaQuestionCircle />, path: "/customer/contact" },
    {
      name: "Notifications",
      icon: <FaBell />,
      path: "/customer/notifications",
    },
  ];

  useEffect(() => {
    const match = menuItems.find((item) =>
      location.pathname.startsWith(item.path)
    );
    if (match) {
      setActiveItem(match.name);
    }
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

  if (!user) return <div className="sidebar-loading">Loading...</div>;

  return (
    <div className={`sidebar customer-sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FaBars size={24} color="#333333" />
      </button>

      <div className="sidebar-content">
        {isOpen && <h2>Welcome, {user?.username}</h2>}
        {isOpen && <h2>Menu</h2>}

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
            </li>
          ))}
        </ul>

        {isOpen && (
          <Button
            fullWidth
            onClick={handleLogout}
            sx={{
              mt: 2,
              backgroundColor: "#333333",
              color: "#ffffff",
              fontWeight: "bold",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#555555",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
          >
            LogOut
          </Button>
        )}
      </div>
    </div>
  );
};

export default SideBar;
