import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const LoginModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  const handleLogin = async (email, password) => {
    const success = await login(email, password);
    if (success) {
      onClose();
    }
  };

  const handleRegister = async (formData) => {
    const success = await register(formData);
    if (success) {
      onClose();
      
      // Redirect based on user type
      if (formData.userType === 'guest') {
        setTimeout(() => navigate('/guest/dashboard'), 100);
      } else {
        setTimeout(() => navigate('/host/dashboard'), 100);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            {activeTab === 'login' ? 'Log in to your account' : 'Create a new account'}
          </h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabChange('login')}
          >
            Login
          </button>
          <button 
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => handleTabChange('register')}
          >
            Register
          </button>
        </div>
        
        {activeTab === 'login' ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <RegisterForm 
            onRegister={handleRegister} 
            userType={userType}
            onUserTypeSelect={handleUserTypeSelect}
          />
        )}
      </div>
    </div>
  );
};

export default LoginModal; 