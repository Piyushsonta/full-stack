import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    age: '',
    contactNumber: '',
    userType: 'guest',
    bankDetails: {
      accountNumber: '',
      bankName: ''
    },
    location: {
      coordinates: [0, 0],
      address: ''
    }
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="auth-page">
        <div className="auth-form-container">
          <h1 className="section-title">Register</h1>
          
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password2">Confirm Password</label>
              <input
                type="password"
                id="password2"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="userType">I want to</label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                required
              >
                <option value="guest">Book Meals</option>
                <option value="host">Host Meals</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bankDetails.bankName">Bank Name</label>
              <input
                type="text"
                id="bankDetails.bankName"
                name="bankDetails.bankName"
                value={formData.bankDetails.bankName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bankDetails.accountNumber">Account Number</label>
              <input
                type="text"
                id="bankDetails.accountNumber"
                name="bankDetails.accountNumber"
                value={formData.bankDetails.accountNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location.address">Address</label>
              <input
                type="text"
                id="location.address"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="btn">
              Register
            </button>
          </form>
          
          <div className="auth-links">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 