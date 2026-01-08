import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the admin token exists in localStorage
  const isAuthenticated = localStorage.getItem('admin_token') === 'true';

  if (!isAuthenticated) {
    // If not logged in, redirect to the Admin Login page
    return <Navigate to="/admin" replace />;
  }

  // If logged in, render the child component (Dashboard)
  return children;
};

export default ProtectedRoute;
