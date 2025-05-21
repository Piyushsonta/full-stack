import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <div className="container">Loading...</div>;
  
  if (!isAuthenticated) return <Navigate to="/" />;
  
  return user && user.userType === 'guest' ? children : <Navigate to="/" />;
};

export default GuestRoute; 