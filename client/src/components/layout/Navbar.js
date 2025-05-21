import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBar from './NotificationBar';
import './NotificationBar.css';
import '../../styles/custom-tooltips.css';
import notificationIcon from '../../assets/notification.svg';
import AOS from 'aos';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Demo notifications for guest users (replace with backend notifications as needed)
  const guestNotifications = [
    { message: "Welcome to HomeMeal! Check out today's new meals.", type: 'info' }
  ];

  // Notification dropdown state
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} data-aos="fade-down">
        <div className="container">
          <div className="navbar-content">
            <Link to="/" className="navbar-brand" title="HomeMeal">
              <i className="fas fa-utensils"></i> HomeMeal
            </Link>

          
          <button className="hamburger" onClick={toggleMenu}>
            <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
          </button>
          
          <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
            <Link to="/" className="nav-link hover-effect" onClick={() => setIsOpen(false)}>
              <i className="fas fa-home"></i> Home
            </Link>
            <Link 
              to={user && user.userType === 'host' ? '/host/meal' : '/browse'} 
              className="nav-link hover-effect" 
              onClick={() => setIsOpen(false)}
            >
              {user && user.userType === 'host' ? (
                <>
                  <i className="fas fa-utensils"></i> Host Meals
                </>
              ) : (
                <>
                  <i className="fas fa-search"></i> Browse
                </>
              )}
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to={user?.userType === 'host' ? '/host-dashboard' : '/guest-dashboard'}
                  className="nav-link hover-effect"
                  onClick={() => setIsOpen(false)}
                >
                  {user?.userType === 'host' ? (
                    <>
                      <i className="fas fa-utensils"></i> Hosted Meal
                    </>
                  ) : (
                    <>
                      <i className="fas fa-tachometer-alt"></i> Dashboard
                    </>
                  )}
                </Link>
                <Link to="/profile" className="nav-link hover-effect" onClick={() => setIsOpen(false)}>
                  <i className="fas fa-user"></i> Profile
                </Link>
                <button onClick={handleLogout} className="nav-link btn-link">
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>

              </>
            ) : (
              <>
                <Link to="/login" className="nav-link hover-effect" onClick={() => setIsOpen(false)} title="Login">
                  <i className="fas fa-sign-in-alt"></i> Login
                </Link>
                <Link to="/register" className="nav-link btn btn-outlined" onClick={() => setIsOpen(false)} title="Register">
                  <i className="fas fa-user-plus"></i> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar; 