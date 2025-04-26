import React from 'react';
import { 
  FaHome, 
  FaSearch, 
  FaCog, 
  FaQuestionCircle, 
  FaBars 
} from 'react-icons/fa'; 
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../styles/customer/sideBar.css';

const SideBar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = React.useState('Home');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const menuItems = [
    { name: 'Home', icon: <FaHome />, path: '/customer/home' },
    { name: 'Find Worker', icon: <FaSearch />, path: '/find-worker' },
    { name: 'Profile', icon: <FaCog />, path: '/customer/profile' },
    { name: 'Contact', icon: <FaQuestionCircle />, path: '/customer/contact' }
  ];

  if (!user) return <div className="sidebar-loading">Loading...</div>;

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
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
              className={activeItem === item.name ? 'active' : ''}
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
              backgroundColor: '#333333',
              color: '#ffffff',
              fontWeight: 'bold',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#555555',
              },
              '&:active': {
                transform: 'scale(0.98)',
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
