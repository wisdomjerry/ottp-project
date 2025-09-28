import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Custom hook
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  // Sync user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  // Sync token to localStorage
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  // Login function
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  // Update profile picture function
  const updateProfilePicture = (newImageUrl) => {
    if (user) {
      const updatedUser = { ...user, profile_picture_url: newImageUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has access to a dashboard
  const canAccessDashboard = (dashboardType) => {
    if (!user) return false;

    switch (dashboardType) {
      case 'admin':
        return user.role === 'admin';
      case 'user':
        return user.role === 'user' || user.role === 'admin';
      default:
        return false;
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    hasRole,
    canAccessDashboard,
    setUser,
    updateProfilePicture, // ✅ add this to context
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

