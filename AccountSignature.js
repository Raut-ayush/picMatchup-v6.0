// frontend/src/components/AccountSignature.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountSignature.css';

const AccountSignature = ({ profilePicture }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleToggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="account-signature">
            <img 
                src={`http://localhost:3000/${profilePicture}`} 
                alt="Profile" 
                className="profile-picture" 
                onClick={handleToggleDropdown} 
            />
            {showDropdown && (
                <div className="dropdown-menu">
                    <button onClick={() => navigate('/settings')}>Settings</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default AccountSignature;
