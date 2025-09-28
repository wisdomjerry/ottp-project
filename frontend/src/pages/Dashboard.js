import React from "react";
import {
  FaMusic,
  FaCalendarAlt,
  FaNewspaper,
  FaCloudSun,
  FaUsers,
  FaPhone,
  FaCommentDots,
  FaVideo,
  FaPowerOff,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // 👈 import your auth hook
import { useNavigate } from "react-router-dom";
import "../dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth(); // 👈 get current user + logout
  const navigate = useNavigate();

  // Handler for clicking the profile image
  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to profile edit page
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-inner">
        {/* Header Card */}
        <div className="card header-card">
          <img
            src={user?.profile_picture_url || "https://via.placeholder.com/80"} // 👈 dynamic image
            alt="profile"
            className="profile-img"
            onClick={handleProfileClick} // 👈 navigate to profile edit
            style={{ cursor: "pointer" }}
          />
          <div className="header-text">
            <h2>{user?.name || user?.email}</h2> {/* 👈 dynamic name */}
            <p>{user?.email}</p> {/* 👈 dynamic email */}
          </div>
        </div>

        {/* Grid of Cards */}
        <div className="grid">
          <div className="card">
            <FaMusic size={28} />
            <p>Music</p>
          </div>
          <div className="card">
            <FaCalendarAlt size={28} />
            <p>Appointments</p>
          </div>
          <div className="card wide">
            <FaNewspaper size={28} />
            <p>Headlines</p>
          </div>
          <div className="card">
            <FaCloudSun size={28} />
            <p>Weather</p>
          </div>
          <div className="card">
            <FaUsers size={28} />
            <p>Social</p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="footer-buttons">
          <button className="icon-btn"><FaPhone /></button>
          <button className="icon-btn"><FaCommentDots /></button>
          <button className="icon-btn"><FaVideo /></button>
          <button className="icon-btn" onClick={logout}><FaPowerOff /></button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

