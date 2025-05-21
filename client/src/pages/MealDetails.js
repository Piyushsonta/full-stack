import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import MapComponent from '../components/map/MapComponent';
import BookingForm from '../components/bookings/BookingForm';
import { useAuth } from '../context/AuthContext';

const MealDetails = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const res = await axios.get(`/api/meals/${id}`);
        setMeal(res.data);
        setError('');
      } catch (err) {
        // Try to find the meal in dummyMeals
        try {
          const { default: dummyMeals } = await import('../data/dummyMeals');
          const found = dummyMeals.find(m => m._id === id);
          if (found) {
            setMeal(found);
            setError('');
          } else {
            setError('Meal not found. Please check the meal ID or try again later.');
          }
        } catch (importErr) {
          setError('Error fetching meal details. Please try again later.');
        }
        console.error('Error fetching meal:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      // Redirect to login or show a message
      alert('Please log in to book this meal');
      return;
    }

    if (user.userType !== 'guest') {
      alert('Only guests can book meals');
      return;
    }

    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
  };

  // Prepare marker for the map
  const getMapMarker = () => {
    if (!meal) return [];

    return [{
      location: meal.location,
      popupContent: (
        <div>
          <h4>{meal.title}</h4>
          <p>Host: {meal.host.name}</p>
        </div>
      )
    }];
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading meal details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <p className="alert alert-danger">{error}</p>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="container">
        <p>Meal not found</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="meal-details-page">
        <div className="meal-details-header" style={{ position: 'relative' }}>
          <img 
            src={meal.image} 
            alt={meal.title} 
            style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
          />
          <button
            className="btn"
            style={{ position: 'absolute', top: '20px', left: '20px' }}
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
        
        <div className="meal-details-content" style={{ padding: '20px 0' }}>
          <h1>{meal.title}</h1>
          <div className="host-info" style={{ margin: '10px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px' }}>
              <strong>Host:</strong> {meal.host.name}
            </span>
            <span>
              <strong>Contact:</strong> {meal.host.contactNumber}
            </span>
          </div>
          
          <div className="meal-info">
            {meal.description && <p>{meal.description}</p>}
            
            <div className="meal-meta" style={{ margin: '20px 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
              <div className="meta-item card" style={{ padding: '15px' }}>
                <h3>Price</h3>
                <p className="price" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${meal.price.toFixed(2)}</p>
              </div>
              
              <div className="meta-item card" style={{ padding: '15px' }}>
                <h3>Serving Time</h3>
                <p>{format(new Date(meal.servingTime), 'PPp')}</p>
              </div>
              
              <div className="meta-item card" style={{ padding: '15px' }}>
                <h3>Location</h3>
                <p>{meal.location && meal.location.address ? meal.location.address : 'Location not available'}</p>
              </div>
              
              <div className="meta-item card" style={{ padding: '15px' }}>
                <h3>Accommodation</h3>
                <p>{meal.withAccommodation ? 'Available' : 'Not Available'}</p>
              </div>
            </div>
          </div>
          
          <div className="meal-map">
            <h2>Location</h2>
            <MapComponent 
              markers={getMapMarker()} 
              center={
                meal.location && Array.isArray(meal.location.coordinates) && meal.location.coordinates.length === 2
                  ? [meal.location.coordinates[1], meal.location.coordinates[0]]
                  : [40.7128, -74.0060] // fallback to NYC
              }
            />
          </div>
          
          <div className="meal-actions" style={{ marginTop: '30px', textAlign: 'center' }}>
            <button 
              className="btn" 
              style={{ padding: '12px 30px', fontSize: '1.2rem' }}
              onClick={handleBookNow}
            >
              Book Now
            </button>
          </div>
        </div>
        
        {showBookingForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Book This Meal</h3>
                <button className="close-btn" onClick={handleCloseBookingForm}>&times;</button>
              </div>
              <BookingForm meal={meal} onClose={handleCloseBookingForm} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealDetails; 