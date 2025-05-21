import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="container">Loading...</div>;
  
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute; 