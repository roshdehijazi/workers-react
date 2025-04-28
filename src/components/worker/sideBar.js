import React, { useState, useEffect } from "react";
import { FaHome, FaWrench, FaBell, FaCog } from "react-icons/fa";
import { Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/worker/sideBar.css";

const WorkerSideBar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (location.pathname.startsWith("/worker/home")) setActiveItem("Home");
    else if (location.pathname.startsWith("/worker/issues")) setActiveItem("Available Issues");
    else if (location.pathname.startsWith("/worker/offers")) setActiveItem("My Offers");
    else if (location.pathname.startsWith("/worker/profile")) setActiveItem("Profile");
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/worker/home" },
    { name: "Available Issues", icon: <FaWrench />, path: "/worker/issues" },
    { name: "My Offers", icon: <FaBell />, path: "/worker/offers" },
    { name: "Profile", icon: <FaCog />, path: "/worker/profile" },
  ];

  if (!user) return <div className="sidebar-loading">Loading...</div>;

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Toggle button */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        <div className="hamburger-icon">
          <div />
          <div />
          <div />
        </div>
      </button>

      {/* Content */}
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
                <span className="icon">{item.icon}</span>
                {isOpen && <span className="text">{item.name}</span>}
              </div>
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
            }}
          >
            LogOut
          </Button>
        )}
      </div>
    </div>
  );
};

export default WorkerSideBar;
