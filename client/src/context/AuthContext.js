import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.baseURL = 'https://full-stack-2zjs.onrender.com';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token for all requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      loadUser();
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      setLoading(false);
    }
  }, [token]);

  // Load user from token
  const loadUser = async () => {
    try {
      const res = await axios.get('/api/users/me');
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      setToken(null);
      localStorage.removeItem('token');
      setError(err.response?.data?.msg || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/users/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        contactNumber: formData.contactNumber,
        userType: formData.userType,
        bankDetails: {
          accountNumber: formData.bankDetails.accountNumber,
          bankName: formData.bankDetails.bankName
        },
        location: {
          coordinates: formData.location.coordinates,
          address: formData.location.address
        }
      });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/users/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      localStorage.setItem('token', res.data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  // Update user information
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Clear errors
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateUser,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 