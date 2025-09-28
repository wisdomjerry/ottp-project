import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token } = useAuth();

  // Not logged in → redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access
  if (requiredRole) {
    // Admins can access any dashboard
    if (user.role === 'admin') {
      return children;
    }

    // If route requires admin, but user is not admin → redirect to user dashboard
    if (requiredRole === 'admin' && user.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }

    // If route requires user, but user is not "user" → redirect to login
    if (requiredRole === 'user' && user.role !== 'user') {
      return <Navigate to="/login" replace />;
    }
  }

  // Authorized
  return children;
};

export default ProtectedRoute;

