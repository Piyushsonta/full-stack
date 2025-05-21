import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const MealCard = ({ meal, onViewDetails, isBooked, onCancelBooking, currentBooking, onPlaceOrder }) => {
  // Check if this is a dummy meal (starts with 'dummy')
  const isDummyMeal = meal._id?.toString().startsWith('dummy') || false;
  
  return (
    <div className="card meal-card h-100">
      {isDummyMeal && (
        <div className="position-absolute top-0 end-0 p-2">
          <span className="badge bg-info">Example</span>
        </div>
      )}
      
      <div className="meal-image position-relative meal-card-clickable" onClick={() => onViewDetails(meal._id)} style={{ cursor: 'pointer' }}>
        <img 
          src={meal.image || 'https://via.placeholder.com/400x200?text=Meal+Image'} 
          alt={meal.title || meal.name || 'Meal'} 
          style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x200?text=Meal+Image';
          }}
        />
        {meal.isVegetarian && (
          <span className="position-absolute bottom-0 start-0 m-2 badge bg-success">
            <i className="fas fa-leaf me-1"></i> Vegetarian
          </span>
        )}
      </div>
      
      <div className="meal-content p-3">
        <h3 className="mb-2 meal-card-clickable" style={{ cursor: 'pointer' }} onClick={() => onViewDetails(meal._id)}>{meal.title || meal.name || 'Unnamed Meal'}</h3>
        <p className="text-muted">{meal.description ? meal.description.substring(0, 100) + '...' : 'No description available'}</p>
        <div className="delivery-time-estimate mb-2">
          <i className="fas fa-clock text-primary me-1"></i>
          <span>Ready in {meal.preparationTime || meal.estimatedDelivery || '30-45'} min</span>
        </div>
        <div className="meal-details my-3">
          <div className="detail d-flex align-items-center mb-2">
            <i className="fas fa-rupee-sign me-2 text-success"></i>
            <strong>Price:</strong> <span className="ms-1">₹{typeof meal.price === 'number' ? meal.price.toFixed(2) : (meal.price || '0.00')}</span>
          </div>
          <div className="detail d-flex align-items-center mb-2">
            <i className="fas fa-clock me-2 text-primary"></i>
            <strong>Serving Time:</strong> <span className="ms-1">{meal.servingTime ? format(new Date(meal.servingTime), 'PPp') : 'Not specified'}</span>
          </div>
          <div className="detail d-flex align-items-center mb-2">
            <i className="fas fa-map-marker-alt me-2 text-danger"></i>
            <strong>Location:</strong> <span className="ms-1">{meal.location?.address || 'Location not specified'}</span>
          </div>
          <div className="detail d-flex align-items-center">
            <i className="fas fa-home me-2 text-info"></i>
            <strong>Accommodation:</strong> <span className="ms-1">
              {meal.withAccommodation || meal.accommodation ? 'Available' : 'Not Available'}
            </span>
          </div>
        </div>
        
        <div className="meal-actions mt-auto d-flex flex-column gap-2 align-items-stretch">
          <button 
            onClick={() => onPlaceOrder(meal)} 
            className="btn btn-danger place-order-btn"
            style={{ fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            <i className="fas fa-shopping-cart me-2"></i> Place Order
          </button>
          <button 
            onClick={() => onViewDetails(meal._id)} 
            className="btn btn-primary view-details-btn"
          >
            <i className="fas fa-info-circle me-2"></i> View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealCard;