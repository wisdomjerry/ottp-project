import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../profile.css';

const Profile = () => {
  const { user, token, setUser, updateProfilePicture, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Handle profile info update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        'http://localhost:5000/api/auth/update-profile',
        { name, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.user) {
        setUser(res.data.user); // update context
      }
      setMessage('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile');
    }
  };

  // Handle profile picture upload
  const handleUploadPicture = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Please select a file');

    const formData = new FormData();
    formData.append('picture', file);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/profile-picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Determine URL from response
      const url =
        res.data.profile_picture_url ||
        (res.data.profile_picture
          ? `http://localhost:5000/uploads/${res.data.profile_picture}`
          : '');

      if (url) updateProfilePicture(url); // ✅ update context so Dashboard refreshes
      setMessage('Profile picture updated successfully!');
      setFile(null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to upload picture');
    }
  };

  return (
    <div className="profile-container">
      {message && <div className="profile-message">{message}</div>}

      <div className="profile-header">
        <img
          src={user?.profile_picture_url || '/default-avatar.png'}
          alt="Profile"
          className="profile-avatar"
        />
        <div className="profile-name">
          <h2>{name}</h2>
          <span className="profile-status">Active</span>
        </div>
      </div>

      {/* Upload picture form */}
      <form onSubmit={handleUploadPicture} className="upload-form">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" className="btn-primary">Upload Picture</button>
      </form>

      {/* Update profile form */}
      <form onSubmit={handleUpdateProfile} className="profile-form">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>New Password (leave blank to keep current)</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="btn-primary">Update Profile</button>
      </form>

      {/* Logout button */}
      <button onClick={logout} className="btn-logout">Logout</button>
    </div>
  );
};

export default Profile;

