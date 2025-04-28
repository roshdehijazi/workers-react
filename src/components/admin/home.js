import React, { useState } from "react";
import AdminSideBar from "./sideBar";
import "../../styles/admin/home.css";

const AdminDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const stats = [
    { title: "Total Users", value: 120, icon: "👤" },
    { title: "Open Issues", value: 45, icon: "🛠️" },
    { title: "Solved Issues", value: 30, icon: "✅" },
    { title: "Revenue", value: "$3400", icon: "💰" },
    { title: "Pending Requests", value: 15, icon: "⏳" },
    { title: "Active Workers", value: 22, icon: "🔧" },
  ];

  return (
    <div className="admin-wrapper">
      <AdminSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`admin-main ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <h2 className="dashboard-title">🛠️ Admin Dashboard</h2>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card fade-in">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <h4>{stat.title}</h4>
                <p>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
