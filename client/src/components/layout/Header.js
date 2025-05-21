import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../auth/LoginModal';
import NotificationBar from './NotificationBar';
import './NotificationBar.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  // Demo notifications, replace with real notification logic as needed
  const guestNotifications = [
    { message: 'Welcome to HomeMeal! Check out today\'s new meals.', type: 'info' },
    // Add more notifications or fetch from backend
  ];

  return (
    <header className="header">

      <div className="container header-content">
        <Link to="/" className="logo">HomeMeal</Link>
        <div>
          {isAuthenticated ? (
            <>
              {user && user.userType === 'guest' ? (
                <Link to="/guest/dashboard" className="btn">
                  Dashboard
                </Link>
              ) : (
                <Link to="/host/dashboard" className="btn">
                  <i className="fas fa-utensils" style={{ marginRight: '5px' }}></i> Hosted Meal
                </Link>
              )}
              <button
                onClick={logout}
                className="btn btn-secondary"
                style={{ marginLeft: '10px' }}
              >
                Logout
              </button>
            </>
          ) : (
            <button onClick={handleLogin} className="btn">
              Login
            </button>
          )}
        </div>
      </div>
      {showLoginModal && <LoginModal onClose={handleCloseModal} />}
    </header>
  );
};

export default Header; 