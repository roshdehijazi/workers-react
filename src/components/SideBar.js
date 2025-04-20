import React, { useState } from 'react';
import { 
    FaHome, 
    FaUsersCog, 
    FaChartLine, 
    FaProjectDiagram, 
    FaCog, 
    FaQuestionCircle ,
  } from 'react-icons/fa';
import { Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/SideBar.css';

const Sidebar = () => {
 const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Home');
  const user = JSON.parse(localStorage.getItem('user'));
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
   
    navigate('/login');
    window.location.reload();
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const baseMenuItems = [
    { name: 'Home', icon: <FaHome />, path: '/' },
    { name: 'Dashboard', icon: <FaChartLine />, path: '/dashboard' },
    { name: 'Projects', icon: <FaProjectDiagram />, path: '/projects' },
  ];


  const adminMenuItems = [
    { name: 'User Management', icon: <FaUsersCog />, path: '/users' }
  ];
  const WorkersItems = [
    { name: 'Find Customer', icon: <FaUsersCog />, path: '/users' }
  ];
  const CustomrsItems = [
    { name: 'Find Worker', icon: <FaUsersCog />, path: '/users' }
  ];

 
  const commonMenuItems = [
    { name: 'Settings', icon: <FaCog />, path: '/settings' },
    { name: 'Help', icon: <FaQuestionCircle />, path: '/help' }
  ];
  const menuItems = [
    ...baseMenuItems,
    ...(user?.role === 'Admin' ? adminMenuItems : []),
    ...(user?.role === 'Worker' ? WorkersItems : []),
    ...(user?.role === 'Customer' ? CustomrsItems : []),
    ...commonMenuItems
  ];
  if (!user) return <div className="sidebar-loading">Loading...</div>;
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? '◄' : '►'}
      </button>
      <div className="sidebar-content">
      <h2>{isOpen ? 'welcome,'+user?.username : ''}</h2>
        <h2>{isOpen ? 'Menu' : ''}</h2>
        <ul>
          {menuItems.map((item) => (
            <li 
              key={item.name}
              className={activeItem === item.name ? 'active' : ''}
              onClick={() => setActiveItem(item.name)}
            >
              <a href={item.Link}>
                <span className="icon">{item.icon}</span>
                {isOpen && <span className="text">{item.name}</span>}
              </a>
            </li>
          ))}
        </ul>
        {isOpen ?  
        <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleLogout}
            sx={{ mt: 2 }}
          >
            LogOut
          </Button>
          :''}
      </div>
    </div>
  );
};

export default Sidebar;