// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if our mock authentication flag exists in the browser storage
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  // If true, render the protected component. If false, redirect them to the login page.
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;