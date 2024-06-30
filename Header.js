// frontend/src/components/Header.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import defaultProfilePic from './defaultProfilePic.png'; // Add a default profile picture

const Header = ({ isAuthenticated, user, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <h1>My App</h1>
        {isAuthenticated && (
          <div className="profile-section" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <img src={user.profilePic || defaultProfilePic} alt="Profile" className="profile-pic" />
            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
              <p>{user.email}</p>
              <button onClick={() => navigate('/account-settings')}>Account Settings</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
