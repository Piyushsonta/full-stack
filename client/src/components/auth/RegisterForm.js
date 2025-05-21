import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = ({ onRegister, userType, onUserTypeSelect }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    contactNumber: '',
    userType: userType || '',
    bankDetails: {
      accountNumber: '',
      bankName: ''
    },
    location: {
      coordinates: [0, 0],
      address: ''
    }
  });

  const { error, clearError } = useAuth();

  useEffect(() => {
    if (userType) {
      setFormData({ ...formData, userType });
    }
  }, [userType]);

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          location: {
            ...formData.location,
            coordinates: [position.coords.longitude, position.coords.latitude]
          }
        });
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }, []);

  const handleChange = (e) => {
    clearError();
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUserTypeSelection = (type) => {
    setFormData({ ...formData, userType: type });
    onUserTypeSelect(type);
    setStep(2);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      
      {step === 1 && (
        <div className="user-type-selection">
          <h4>Register as:</h4>
          <div className="user-type-buttons">
            <button 
              type="button" 
              className={`btn ${formData.userType === 'guest' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleUserTypeSelection('guest')}
            >
              Guest
            </button>
            <button 
              type="button" 
              className={`btn ${formData.userType === 'host' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleUserTypeSelection('host')}
              style={{ marginLeft: '10px' }}
            >
              Host
            </button>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div className="personal-info">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
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
              className="form-control"
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
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              className="form-control"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              className="form-control"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="button-group">
            <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
              Back
            </button>
            <button type="button" className="btn" onClick={handleNextStep} style={{ marginLeft: '10px' }}>
              Next
            </button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="banking-location-info">
          <h4>Banking Information</h4>
          <div className="form-group">
            <label htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              id="bankName"
              name="bankDetails.bankName"
              className="form-control"
              value={formData.bankDetails.bankName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              name="bankDetails.accountNumber"
              className="form-control"
              value={formData.bankDetails.accountNumber}
              onChange={handleChange}
              required
            />
          </div>
          
          <h4>Location Information</h4>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="location.address"
              className="form-control"
              value={formData.location.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="button-group">
            <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
              Back
            </button>
            <button type="submit" className="btn" style={{ marginLeft: '10px' }}>
              Register
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default RegisterForm; 