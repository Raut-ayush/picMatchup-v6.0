// frontend/src/pages/AccountSettings.js
import React, { useState } from 'react';
import axios from 'axios';
import './AccountSettings.css';

const AccountSettings = () => {
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState('');

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('email', email);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      await axios.post('http://localhost:3000/api/auth/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile.');
    }
  };

  return (
    <div className="account-settings-container">
      <h2>Account Settings</h2>
      <form onSubmit={handleUpdate}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="profilePicture">Profile Picture:</label>
        <input
          type="file"
          id="profilePicture"
          onChange={handleProfilePictureChange}
        />
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AccountSettings;
