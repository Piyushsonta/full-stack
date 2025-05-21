import React, { useState, useEffect } from 'react';
import { format, addHours } from 'date-fns';

const MealForm = ({ initialData, onSubmit, buttonText = 'Submit' }) => {
  const minServingTime = format(addHours(new Date(), 5), "yyyy-MM-dd'T'HH:mm");

  // Default expiry duration in hours
  const defaultExpiryDuration = 2;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
    location: {
      coordinates: [0, 0],
      address: ''
    },
    servingTime: minServingTime,
    withAccommodation: false,
    expiryDuration: defaultExpiryDuration, // in hours
    ...initialData
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (!initialData) {
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
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.image || !formData.price || 
        !formData.location.address || !formData.servingTime) {
      setError('All fields are required');
      return false;
    }
    
    const servingTime = new Date(formData.servingTime);
    const minTime = addHours(new Date(), 5);
    
    if (servingTime < minTime) {
      setError('Serving time must be at least 5 hours from now');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Calculate expiryTime: expiryDuration hours after servingTime
      const servingTimeDate = new Date(formData.servingTime);
      const expiryTime = new Date(servingTimeDate.getTime() + parseInt(formData.expiryDuration) * 60 * 60 * 1000);
      onSubmit({
        ...formData,
        price: parseFloat(formData.price),
        expiryTime: expiryTime.toISOString()
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">Meal Title</label>
        <input
          type="text"
          id="title"
          name="title"
          className="form-control"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          className="form-control"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          required
        ></textarea>
      </div>
      
      <div className="form-group">
        <label htmlFor="image">Image URL</label>
        <input
          type="text"
          id="image"
          name="image"
          className="form-control"
          value={formData.image}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="price">Price ($)</label>
        <input
          type="number"
          id="price"
          name="price"
          className="form-control"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />
      </div>
      
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
      
      <div className="form-group">
        <label htmlFor="servingTime">Serving Time</label>
        <input
          type="datetime-local"
          id="servingTime"
          name="servingTime"
          className="form-control"
          value={formData.servingTime}
          onChange={handleChange}
          min={minServingTime}
          required
        />
        <small className="form-text text-muted">
          Serving time must be at least 5 hours from now
        </small>
      </div>
      
      <div className="form-group">
        <label htmlFor="expiryDuration">Meal Visible For (hours)</label>
        <input
          type="number"
          id="expiryDuration"
          name="expiryDuration"
          className="form-control"
          value={formData.expiryDuration}
          onChange={handleChange}
          min="1"
          max="24"
          required
        />
        <small className="form-text text-muted">
          Number of hours after serving time the meal will be visible to guests.
        </small>
      </div>
      
      <div className="form-group">
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              name="withAccommodation"
              checked={formData.withAccommodation}
              onChange={handleChange}
            />
            Accommodation Available
          </label>
        </div>
      </div>
      
      <button type="submit" className="btn">
        {buttonText}
      </button>
    </form>
  );
};

export default MealForm;