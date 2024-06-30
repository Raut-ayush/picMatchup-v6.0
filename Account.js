// frontend/src/components/Account.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';

const Account = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="account-container">
      <img src={user.profilePicture} alt="Profile" className="profile-picture" />
      <div className="dropdown">
        <button className="dropbtn">Account</button>
        <div className="dropdown-content">
          <a onClick={() => navigate('/settings')}>Settings</a>
          <a onClick={handleLogout}>Logout</a>
        </div>
      </div>
    </div>
  );
};

export default Account;
