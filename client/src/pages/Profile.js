import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';

// Update the DEFAULT_PROFILE_IMAGE URL to a more reliable source
const DEFAULT_PROFILE_IMAGE = 'https://raw.githubusercontent.com/shadcn/ui/main/apps/www/public/avatars/01.png';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    location: {
      address: ''
    },
    profileImage: null
  });
  const [imagePreview, setImagePreview] = useState(DEFAULT_PROFILE_IMAGE);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Function to validate image URL
  const isValidImageUrl = (url) => {
    return url && url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  };

  useEffect(() => {
    // Pre-load the default image
    const defaultImg = new Image();
    defaultImg.src = DEFAULT_PROFILE_IMAGE;
    
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        contactNumber: user.contactNumber || '',
        location: {
          address: user.location?.address || ''
        },
        profileImage: user.profileImage || null
      });
      
      // Set image preview with validation
      if (user.profileImage && isValidImageUrl(user.profileImage)) {
        const userImg = new Image();
        userImg.onload = () => setImagePreview(user.profileImage);
        userImg.onerror = () => setImagePreview(DEFAULT_PROFILE_IMAGE);
        userImg.src = user.profileImage;
      } else {
        setImagePreview(DEFAULT_PROFILE_IMAGE);
      }
    } else {
      setImagePreview(DEFAULT_PROFILE_IMAGE);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'address') {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          address: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
        toast.success('Image selected successfully');
      };
      reader.onerror = () => {
        toast.error('Error reading file');
        setImagePreview(DEFAULT_PROFILE_IMAGE);
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is selected or user cancels, revert to default image
      setImagePreview(DEFAULT_PROFILE_IMAGE);
      setFormData(prev => ({
        ...prev,
        profileImage: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      const res = await axios.put('/api/users/profile', formData);
      updateUser(res.data);
      toast.success('Profile updated successfully');
      setMessage('Profile updated successfully');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile';
      toast.error(errorMsg);
      setError(errorMsg);
    }
  };

  return (
    <div className="profile-container" data-aos="fade-up">
      <h2 className="text-center mb-4">Profile</h2>
      
      <div className="profile-image-section">
        <div className="profile-image-container">
          <img 
            src={imagePreview}
            alt="Profile" 
            className="profile-image"
            onError={(e) => {
              e.target.onerror = null;
              setImagePreview(DEFAULT_PROFILE_IMAGE);
              toast.warning('Error loading image, using default avatar');
            }}
          />
        </div>
        <label className="profile-image-upload">
          Change Photo
          <input
            type="file"
            className="profile-image-input"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
      </div>

      <div className="profile-details">
        {message && (
          <div className="alert alert-success">{message}</div>
        )}
        
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
              disabled
            />
            <small>Email cannot be changed</small>
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
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.location.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="btn">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile; 