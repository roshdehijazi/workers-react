import React, { useState, useEffect } from "react";
import { FaHome, FaUsers, FaClipboardList, FaTools } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/admin/sideBar.css";

const AdminSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    if (location.pathname.startsWith("/admin/home")) setActiveItem("Home");
    else if (location.pathname.startsWith("/admin/users"))
      setActiveItem("Manage Users");
    else if (location.pathname.startsWith("/admin/issues"))
      setActiveItem("Manage Issues");
    else if (location.pathname.startsWith("/admin/settings"))
      setActiveItem("Settings");
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/admin/home" },
    { name: "Manage Users", icon: <FaUsers />, path: "/admin/users" },
    { name: "Manage Issues", icon: <FaClipboardList />, path: "/admin/issues" },
    { name: "Settings", icon: <FaTools />, path: "/admin/settings" },
  ];

  return (
    <div className={`admin-sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <div className="hamburger-icon">
          <div />
          <div />
          <div />
        </div>
      </button>

      <div className="sidebar-content">
        <h2>{isOpen ? "Admin Panel" : ""}</h2>
        <h3>{isOpen ? "Menu" : ""}</h3>
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
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminSideBar;
