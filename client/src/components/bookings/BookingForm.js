import React, { useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const BookingForm = ({ meal, onClose }) => {
  const [paymentId, setPaymentId] = useState('payment_' + Math.random().toString(36).substr(2, 9));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // In a real app, we would integrate with a payment gateway here
      // For now, we'll simulate a payment and use a mock payment ID
      
      // Create booking
      await axios.post('/api/bookings', {
        mealId: meal._id,
        paymentId
      });
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        navigate('/guest/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error creating booking');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h3>Book This Meal</h3>
      
      {success ? (
        <div className="alert alert-success">
          Booking successful! Redirecting to dashboard...
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <div className="booking-summary">
            <h4>Booking Summary</h4>
            <div className="detail">
              <strong>Meal:</strong> {meal && meal.title ? meal.title : 'N/A'}
            </div>
            <div className="detail">
              <strong>Host:</strong> {meal && meal.host && meal.host.name ? meal.host.name : 'N/A'}
            </div>
            <div className="detail">
              <strong>Price:</strong> ${meal && meal.price ? meal.price.toFixed(2) : 'N/A'}
            </div>
            <div className="detail">
              <strong>Serving Time:</strong> {meal && meal.servingTime ? format(new Date(meal.servingTime), 'PPp') : 'N/A'}
            </div>
            <div className="detail">
              <strong>Location:</strong> {meal && meal.location && meal.location.address ? meal.location.address : 'N/A'}
            </div>
          </div>
          
          <div className="payment-section">
            <h4>Payment Details</h4>
            <p>
              In a real application, this would be integrated with a payment gateway like Stripe or PayPal.
              For demo purposes, clicking "Pay Now" will simulate a payment.
            </p>
          </div>
          
          <button 
            type="submit" 
            className="btn"
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay Now $${meal && meal.price ? meal.price.toFixed(2) : 'N/A'}`}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookingForm; 