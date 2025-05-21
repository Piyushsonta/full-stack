import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HostRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <div className="container">Loading...</div>;
  
  if (!isAuthenticated) return <Navigate to="/" />;
  
  return user && user.userType === 'host' ? children : <Navigate to="/" />;
};

export default HostRoute; 