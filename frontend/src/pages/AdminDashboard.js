import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <p>Loading user...</p>;

  // Force navigation to user dashboard
  const goToUserDashboard = () => {
    navigate('/dashboard', { replace: true }); // replace ensures history updates correctly
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome, {user.name || 'Admin'}!</h1>
        <h2 style={styles.subtitle}>Admin Dashboard</h2>
        <p style={styles.info}>
          This dashboard is only accessible by users with the <b>admin</b> role.
        </p>

        <div style={styles.buttonGroup}>
          <button
            style={{ ...styles.button, ...styles.primaryBtn }}
            onClick={goToUserDashboard}
          >
            Go to User Dashboard
          </button>
          <button style={{ ...styles.button, ...styles.logoutBtn }} onClick={logout}>
            Logout
          </button>

          
        </div>
      </div>

      <div style={styles.panel}>
        <h3 style={styles.panelTitle}>Admin Panel</h3>
        <ul style={styles.panelList}>
          <li style={styles.panelItem}>
            <Link to="/admin/manage-users" style={styles.link}>
              View Users
            </Link>
          </li>
          <li style={styles.panelItem}>View Reports</li>
          <li style={styles.panelItem}>System Settings</li>
          <li style={styles.panelItem}>Analytics & Metrics</li>
        </ul>
      </div>
      
    </div>
  
     
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.2rem',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#444',
    marginBottom: '0.5rem',
  },
  info: {
    fontSize: '1rem',
    color: '#666',
  },
  buttonGroup: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  button: {
    padding: '0.7rem 1.2rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
  primaryBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
    color: '#fff',
  },
  panel: {
    background: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  panelTitle: {
    marginBottom: '1rem',
    fontSize: '1.3rem',
    borderBottom: '2px solid #007bff',
    display: 'inline-block',
    paddingBottom: '0.2rem',
  },
  panelList: {
    listStyle: 'none',
    padding: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
  },
  panelItem: {
    background: '#fff',
    padding: '1rem',
    borderRadius: '6px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    width: '100%',
    height: '100%',
  },
};

export default AdminDashboard;
