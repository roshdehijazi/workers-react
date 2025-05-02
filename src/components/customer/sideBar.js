import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaSearch,
  FaCog,
  FaQuestionCircle,
  FaBars,
} from "react-icons/fa";
import { Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/customer/sideBar.css";

// ✅ Move menuItems OUTSIDE the component
const menuItems = [
  { name: "Home", icon: <FaHome />, path: "/customer/home" },
  { name: "Find Worker", icon: <FaSearch />, path: "/find-worker" },
  { name: "Profile", icon: <FaCog />, path: "/customer/profile" },
  { name: "Contact", icon: <FaQuestionCircle />, path: "/customer/contact" },
];

const SideBar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("Home");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const match = menuItems.find((item) =>
      location.pathname.startsWith(item.path)
    );
    if (match) {
      setActiveItem(match.name);
    }
  }, [location.pathname]);

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
              <span className="icon">{item.icon}</span>
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
