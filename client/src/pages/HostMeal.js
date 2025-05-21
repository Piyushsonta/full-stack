import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { FaUtensils, FaClock, FaImage } from 'react-icons/fa';

const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snacks', 'dessert'];
const CUISINES = ['indian', 'chinese', 'italian', 'mexican', 'thai', 'japanese', 'american', 'other'];
const DIETARY_PREFERENCES = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'halal', 'kosher'];
const SPICY_LEVELS = ['mild', 'medium', 'hot', 'extra-hot'];

const HostMeal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [mealData, setMealData] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    cuisine: CUISINES[0],
    price: '',
    servingDate: format(new Date(), 'yyyy-MM-dd'),
    servingTime: format(new Date(), 'HH:mm'),
    expiryTime: '2', // Default 2 hours
    maxGuests: 4,
    isVegetarian: false, // Explicit vegetarian flag
    dietaryPreferences: [],
    ingredients: [''],
    allergens: '',
    preparationTime: 30,
    spicyLevel: 'medium',
    withAccommodation: false,
    image: null,
    imagePreview: null,
    location: {
      address: '',
      coordinates: []
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMealData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDietaryPreferenceChange = (preference) => {
    setMealData(prev => {
      const preferences = [...prev.dietaryPreferences];
      if (preferences.includes(preference)) {
        return {
          ...prev,
          dietaryPreferences: preferences.filter(p => p !== preference)
        };
      } else {
        return {
          ...prev,
          dietaryPreferences: [...preferences, preference]
        };
      }
    });
  };

  const handleIngredientChange = (index, value) => {
    setMealData(prev => {
      const ingredients = [...prev.ingredients];
      ingredients[index] = value;
      return {
        ...prev,
        ingredients
      };
    });
  };

  const addIngredient = () => {
    setMealData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index) => {
    setMealData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Compress the image before storing it
      compressImage(file, 800, 600, 0.7).then(compressedImage => {
        setMealData({
          ...mealData,
          image: compressedImage,
          imagePreview: compressedImage
        });
      });
    }
  };

  // Function to compress images before upload
  const compressImage = (file, maxWidth, maxHeight, quality) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          // Create canvas with max dimensions
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress image
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!mealData.title || !mealData.description || !mealData.image || !mealData.price || !mealData.location || !mealData.location.address) {
        throw new Error('Please fill in all required fields');
      }

      const servingDateTime = new Date(mealData.servingDate + 'T' + mealData.servingTime);
      const expiryDateTime = new Date(servingDateTime.getTime() + (parseInt(mealData.expiryTime) * 60 * 60 * 1000));

      // Set default serving time to tomorrow at the same time if not explicitly set
      // This avoids the 5-hour validation error
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Only validate if the user has explicitly changed the date/time
      // Otherwise, we'll use a safe default
      if (mealData.servingDate !== format(new Date(), 'yyyy-MM-dd') || 
          mealData.servingTime !== format(new Date(), 'HH:mm')) {
            
        // Check if serving time is at least 5 hours from now
        const fiveHoursLater = new Date(now.getTime() + 5 * 60 * 60 * 1000);
        if (servingDateTime < fiveHoursLater) {
          throw new Error('Serving time must be at least 5 hours from now. Please select a later time.');
        }
      } else {
        // Use tomorrow as a safe default
        servingDateTime = tomorrow;
      }

      // Create location object with coordinates (mock coordinates for now)
      const locationWithCoordinates = {
        address: mealData.location.address,
        coordinates: [77.2090, 28.6139] // Default coordinates (will be replaced with geocoding in production)
      };

      // Map frontend fields to backend model fields
      const mealPayload = {
        // Required by Meal model schema
        name: mealData.title, // Frontend uses 'title', backend expects 'name'
        description: mealData.description,
        category: mealData.category,
        cuisine: mealData.cuisine,
        ingredients: mealData.ingredients.filter(i => i.trim()),
        servingTime: servingDateTime.toISOString(),
        expiryTime: expiryDateTime.toISOString(),
        price: parseFloat(mealData.price),
        image: mealData.image,
        maxServings: parseInt(mealData.maxGuests),
        preparationTime: parseInt(mealData.preparationTime),
        // Optional fields with defaults
        dietaryPreferences: mealData.dietaryPreferences,
        spicyLevel: mealData.spicyLevel,
        allergens: mealData.allergens || '',
        location: locationWithCoordinates,
        withAccommodation: mealData.withAccommodation,
        // No need to send host/hostId - it's set by the backend from the authenticated user
      };
      
      console.log('Submitting meal with payload:', mealPayload);

      const response = await axios.post('/api/meals', mealPayload);
      console.log('Server response:', response.data);
      
      setSuccess(true);
      toast.success('Meal hosted successfully! It will be visible to guests until the expiry time.');
      
      // Reset form or redirect
      setTimeout(() => {
        navigate('/host-dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error hosting meal:', err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with an error
        console.error('Server error response:', err.response.data);
        setError(err.response.data.msg || err.response.data.message || 'Server error. Please try again.');
        toast.error(err.response.data.msg || 'Error hosting meal. Check console for details.');
      } else if (err.request) {
        // Request was made but no response received (network error)
        console.error('Network error - no response received');
        setError('Network error. Please check your connection and try again.');
        toast.error('Network error. Please check your connection.');
      } else {
        // Client-side validation error or other error
        console.error('Client error:', err.message);
        setError(err.message || 'Failed to host meal. Please try again.');
        toast.error(err.message || 'Error hosting meal. Please check form fields.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="host-meal-page py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0 rounded-lg overflow-hidden">
              <div 
                className="card-header text-white text-center py-4" 
                style={{
                  backgroundImage: 'linear-gradient(to right, #5e72e4, #825ee4)',
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  width: '100%',
                  margin: 0,
                  padding: '1.5rem',
                  borderBottom: 'none'
                }}
              >
                <h2 className="mb-0 fw-bold">
                  <FaUtensils className="me-2" /> Host a New Meal Experience
                </h2>
                <p className="text-white-50 mt-2 mb-0">Share your culinary skills with guests from around the world</p>
              </div>
              <div className="card-body p-4 p-lg-5">
                {error && <div className="alert alert-danger d-flex align-items-center"><i className="fas fa-exclamation-circle me-2"></i>{error}</div>}
                {success && (
                  <div className="alert alert-success d-flex align-items-center">
                    <i className="fas fa-check-circle me-2"></i> Meal hosted successfully! Guests can now book your meal.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="needs-validation">
                  <div className="progress mb-4" style={{height: '8px'}}>
                    <div className="progress-bar bg-success" role="progressbar" style={{width: '100%'}} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  
                  <p className="text-muted mb-4">Fill out the form below to add your delicious meal to the platform. Fields marked with * are required.</p>

                  <div className="card mb-4 border-0 shadow-sm" style={{borderRadius: '15px', background: 'linear-gradient(to right, #f8f9fa, #ffffff)'}}>
                    <div className="card-body p-4">
                      <h5 className="card-title mb-3 text-primary"><i className="fas fa-info-circle me-2"></i>Basic Information</h5>
                      <p className="text-muted small mb-4">Provide essential details about your meal offering</p>
                      
                      <div className="form-group mb-4">
                        <label htmlFor="title" className="form-label fw-bold">
                          <i className="fas fa-utensils me-2 text-primary"></i> Meal Title *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg shadow-sm"
                          id="title"
                          name="title"
                          value={mealData.title}
                          onChange={handleChange}
                          required
                          placeholder="Give your meal a catchy name"
                        />
                        <small className="text-muted">Make it descriptive and appealing to attract guests</small>
                      </div>

                      <div className="form-group mb-4">
                        <label htmlFor="description" className="form-label fw-bold">Description *</label>
                        <textarea
                          className="form-control shadow-sm"
                          id="description"
                          name="description"
                          value={mealData.description}
                          onChange={handleChange}
                          required
                          placeholder="Describe your dish, cooking method, ingredients, and what makes it special..."
                          rows="4"
                        />
                        <small className="text-muted">A detailed description helps guests know what to expect</small>
                      </div>
                      
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="category" className="form-label fw-bold">Category *</label>
                            <select
                              className="form-select shadow-sm"
                              id="category"
                              name="category"
                              value={mealData.category}
                              onChange={handleChange}
                              required
                            >
                              {CATEGORIES.map(category => (
                                <option key={category} value={category}>
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="cuisine" className="form-label fw-bold">Cuisine *</label>
                            <select
                              className="form-select shadow-sm"
                              id="cuisine"
                              name="cuisine"
                              value={mealData.cuisine}
                              onChange={handleChange}
                              required
                            >
                              {CUISINES.map(cuisine => (
                                <option key={cuisine} value={cuisine}>
                                  {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-4 border-0 shadow-sm" style={{borderRadius: '15px', background: 'linear-gradient(to right, #f8f9fa, #ffffff)'}}>
                    <div className="card-body p-4">
                      <h5 className="card-title mb-3 text-primary"><i className="fas fa-leaf me-2"></i>Dietary Information</h5>
                      <p className="text-muted small mb-4">Help guests with dietary restrictions find your meal</p>
                      
                      <div className="form-group mb-4">
                        <label className="form-label fw-bold mb-3">Is this meal vegetarian? *</label>
                        <div className="d-flex gap-3">
                          <div 
                            className={`card border-0 shadow-sm p-3 text-center ${mealData.isVegetarian ? 'bg-success bg-opacity-10 border border-success' : ''}`} 
                            style={{cursor: 'pointer', borderRadius: '10px', minWidth: '120px'}}
                            onClick={() => setMealData({...mealData, isVegetarian: true})}
                          >
                            <div className="mb-2">
                              <span className="badge bg-success p-2 rounded-circle">
                                <i className="fas fa-leaf fa-lg"></i>
                              </span>
                            </div>
                            <div className="form-check justify-content-center">
                              <input
                                type="radio"
                                className="form-check-input me-2"
                                id="vegetarian-yes"
                                name="isVegetarian"
                                checked={mealData.isVegetarian}
                                onChange={() => setMealData({...mealData, isVegetarian: true})}
                                required
                              />
                              <label className="form-check-label fw-bold" htmlFor="vegetarian-yes">
                                Vegetarian
                              </label>
                            </div>
                          </div>
                          
                          <div 
                            className={`card border-0 shadow-sm p-3 text-center ${!mealData.isVegetarian ? 'bg-danger bg-opacity-10 border border-danger' : ''}`} 
                            style={{cursor: 'pointer', borderRadius: '10px', minWidth: '120px'}}
                            onClick={() => setMealData({...mealData, isVegetarian: false})}
                          >
                            <div className="mb-2">
                              <span className="badge bg-danger p-2 rounded-circle">
                                <i className="fas fa-drumstick-bite fa-lg"></i>
                              </span>
                            </div>
                            <div className="form-check justify-content-center">
                              <input
                                type="radio"
                                className="form-check-input me-2"
                                id="vegetarian-no"
                                name="isVegetarian"
                                checked={!mealData.isVegetarian}
                                onChange={() => setMealData({...mealData, isVegetarian: false})}
                                required
                              />
                              <label className="form-check-label fw-bold" htmlFor="vegetarian-no">
                                Non-Vegetarian
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Additional Dietary Options</label>
                        <div className="row g-2">
                          {DIETARY_PREFERENCES.map(preference => (
                            <div className="col-md-4 col-6" key={preference}>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`preference-${preference}`}
                                  checked={mealData.dietaryPreferences.includes(preference)}
                                  onChange={() => handleDietaryPreferenceChange(preference)}
                                />
                                <label className="form-check-label" htmlFor={`preference-${preference}`}>
                                  {preference.charAt(0).toUpperCase() + preference.slice(1)}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="spicyLevel" className="form-label fw-bold">Spice Level</label>
                        <select
                          className="form-select shadow-sm"
                          id="spicyLevel"
                          name="spicyLevel"
                          value={mealData.spicyLevel}
                          onChange={handleChange}
                        >
                          {SPICY_LEVELS.map(level => (
                            <option key={level} value={level}>
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="allergens" className="form-label fw-bold">Allergens</label>
                        <input
                          type="text"
                          className="form-control shadow-sm"
                          id="allergens"
                          name="allergens"
                          value={mealData.allergens}
                          onChange={handleChange}
                          placeholder="e.g., nuts, dairy, shellfish (comma separated)"
                        />
                        <small className="text-muted">List potential allergens to help guests with allergies</small>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-4 border-0 shadow-sm" style={{borderRadius: '15px', background: 'linear-gradient(to right, #f8f9fa, #ffffff)'}}>
                    <div className="card-body p-4">
                      <h5 className="card-title mb-3 text-primary"><i className="fas fa-carrot me-2"></i>Ingredients</h5>
                      <p className="text-muted small mb-4">List the ingredients you'll use in your meal</p>
                      
                      {mealData.ingredients.map((ingredient, index) => (
                        <div key={index} className="input-group mb-2">
                          <span className="input-group-text bg-light">{index + 1}</span>
                          <input
                            type="text"
                            className="form-control"
                            value={ingredient}
                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                            placeholder="Enter ingredient"
                            required
                          />
                          {mealData.ingredients.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => removeIngredient(index)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm mt-4 mb-2"
                        onClick={addIngredient}
                      >
                        <i className="fas fa-plus me-1"></i> Add Ingredient
                      </button>
                    </div>
                  </div>

                  <div className="card mb-4 border-0 shadow-sm" style={{borderRadius: '15px', background: 'linear-gradient(to right, #f8f9fa, #ffffff)'}}>
                    <div className="card-body p-4">
                      <h5 className="card-title mb-3 text-primary"><i className="fas fa-utensils me-2"></i>Meal Details</h5>
                      <p className="text-muted small mb-4">Tell guests about your culinary creation</p>
                      
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="servingDate" className="form-label fw-bold">
                              <FaClock className="me-2 text-primary" /> Serving Date *
                            </label>
                            <input
                              type="date"
                              className="form-control shadow-sm"
                              id="servingDate"
                              name="servingDate"
                              value={mealData.servingDate}
                              onChange={handleChange}
                              required
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="servingTime" className="form-label fw-bold">Serving Time *</label>
                            <input
                              type="time"
                              className="form-control shadow-sm"
                              id="servingTime"
                              name="servingTime"
                              value={mealData.servingTime}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="form-group mb-3">
                        <label htmlFor="expiryTime" className="form-label fw-bold">
                          <FaClock className="me-2 text-primary" /> Visibility Duration (hours) *
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control shadow-sm"
                            id="expiryTime"
                            name="expiryTime"
                            value={mealData.expiryTime}
                            onChange={handleChange}
                            required
                            min="1"
                            max="24"
                          />
                          <span className="input-group-text">hours</span>
                        </div>
                        <small className="text-muted">
                          Your meal will be visible to guests for this many hours after the serving time.
                        </small>
                      </div>
                      
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="preparationTime" className="form-label fw-bold">Preparation Time (minutes) *</label>
                            <input
                              type="number"
                              className="form-control shadow-sm"
                              id="preparationTime"
                              name="preparationTime"
                              value={mealData.preparationTime}
                              onChange={handleChange}
                              required
                              min="1"
                              placeholder="Time needed to prepare"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="price" className="form-label fw-bold">Price per Serving (₹) *</label>
                            <input
                              type="number"
                              className="form-control shadow-sm"
                              id="price"
                              name="price"
                              value={mealData.price}
                              onChange={handleChange}
                              required
                              min="0"
                              step="0.01"
                              placeholder="Enter price per serving"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-4 border-0 shadow-sm" style={{borderRadius: '15px', background: 'linear-gradient(to right, #f8f9fa, #ffffff)'}}>
                    <div className="card-body p-4">
                      <h5 className="card-title mb-3 text-primary"><i className="fas fa-camera me-2"></i>Meal Image</h5>
                      <p className="text-muted small mb-4">A picture is worth a thousand words - showcase your delicious creation</p>
                      
                      {mealData.imagePreview && (
                        <div className="text-center mb-3">
                          <img 
                            src={mealData.imagePreview} 
                            alt="Meal preview" 
                            style={{ maxWidth: '100%', maxHeight: '250px', objectFit: 'cover' }}
                            className="rounded shadow-sm"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        className="form-control shadow-sm"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        required={!mealData.image}
                      />
                      <small className="text-muted d-block mt-2">Upload a high-quality image of your meal to attract guests</small>
                    </div>
                  </div>

                  <div className="card mb-4 border-0 shadow-sm" style={{borderRadius: '15px', background: 'linear-gradient(to right, #f8f9fa, #ffffff)'}}>
                    <div className="card-body p-4">
                      <h5 className="card-title mb-3 text-primary"><i className="fas fa-cog me-2"></i>Additional Options</h5>
                      <p className="text-muted small mb-4">Provide extra details to enhance the guest experience</p>
                      
                      <div className="form-group mb-3">
                        <label className="form-label d-block fw-bold">Accommodation Option</label>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="withAccommodation"
                            name="withAccommodation"
                            checked={mealData.withAccommodation}
                            onChange={(e) => setMealData({...mealData, withAccommodation: e.target.checked})}
                          />
                          <label className="form-check-label" htmlFor="withAccommodation">
                            Offer accommodation with this meal
                          </label>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="location.address" className="form-label fw-bold">Address *</label>
                        <input
                          type="text"
                          className="form-control shadow-sm"
                          id="location.address"
                          name="location.address"
                          value={mealData.location.address}
                          onChange={(e) => setMealData({...mealData, location: {...mealData.location, address: e.target.value}})}
                          required
                          placeholder="Enter your address"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="card border-0 shadow-sm mb-4" style={{borderRadius: '15px', background: 'rgba(94, 114, 228, 0.05)'}}>
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-primary p-3 rounded-circle me-3 text-white">
                            <i className="fas fa-lightbulb"></i>
                          </div>
                          <div>
                            <h5 className="mb-1">Tips for a Great Meal Listing</h5>
                            <p className="mb-0 text-muted">Help your meal stand out to potential guests</p>
                          </div>
                        </div>
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item bg-transparent border-0 ps-0 py-2"><i className="fas fa-check-circle text-success me-2"></i> Use high-quality, appetizing photos of your meal</li>
                          <li className="list-group-item bg-transparent border-0 ps-0 py-2"><i className="fas fa-check-circle text-success me-2"></i> Write a detailed, mouth-watering description</li>
                          <li className="list-group-item bg-transparent border-0 ps-0 py-2"><i className="fas fa-check-circle text-success me-2"></i> Be clear about dietary options and ingredients</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="d-grid gap-2">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg py-3 shadow-lg" 
                        style={{borderRadius: '10px', background: 'linear-gradient(to right, #5e72e4, #825ee4)'}}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Creating Your Meal...
                          </>
                        ) : (
                          <>
                            <FaUtensils className="me-2" /> Host This Meal
                          </>
                        )}
                      </button>
                      <p className="text-center text-muted mt-3">
                        By hosting a meal, you agree to our <a href="#" className="text-decoration-none">Terms of Service</a> and <a href="#" className="text-decoration-none">Community Guidelines</a>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostMeal;
