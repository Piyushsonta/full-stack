import React from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BookingCard = ({ booking, onStatusChange }) => {
  const { user } = useAuth();
  const isHost = user && user.userType === 'host';
  const isGuest = user && user.userType === 'guest';
  
  const handleAccept = async () => {
    try {
      const res = await axios.put(`/api/bookings/${booking._id}/status`, { status: 'accepted' });
      onStatusChange(res.data);
    } catch (err) {
      console.error('Error accepting booking:', err);
    }
  };
  
  const handleReject = async () => {
    try {
      const res = await axios.put(`/api/bookings/${booking._id}/status`, { status: 'rejected' });
      onStatusChange(res.data);
    } catch (err) {
      console.error('Error rejecting booking:', err);
    }
  };
  
  const handleCancel = async () => {
    try {
      const res = await axios.put(`/api/bookings/${booking._id}/cancel`);
      onStatusChange(res.data);
    } catch (err) {
      console.error('Error cancelling booking:', err);
    }
  };
  
  const handleComplete = async () => {
    try {
      const res = await axios.put(`/api/bookings/${booking._id}/complete`);
      onStatusChange(res.data);
    } catch (err) {
      console.error('Error completing booking:', err);
    }
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'accepted':
        return 'status-accepted';
      case 'rejected':
        return 'status-rejected';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  };
  
  return (
    <div className="card booking-card">
      <div className="booking-header">
        <h3>{booking.meal && booking.meal.title ? booking.meal.title : 'N/A'}</h3>
        <span className={`booking-status ${getStatusClass(booking.status)}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>
      
      <div className="booking-details">
        <div className="detail">
          <strong>Price:</strong> {typeof booking.paymentAmount === 'number' ? `₹${booking.paymentAmount.toFixed(2)}` : 'N/A'}
        </div>
        <div className="detail">
          <strong>Serving Time:</strong> {booking.meal && booking.meal.servingTime ? format(new Date(booking.meal.servingTime), 'PPp') : 'N/A'}
        </div>
        <div className="detail">
          <strong>Location:</strong> {booking.meal && booking.meal.location && booking.meal.location.address ? booking.meal.location.address : 'N/A'}
        </div>
        <div className="detail">
          <strong>Payment Status:</strong> {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
        </div>
        <div className="detail">
          <strong>{isHost ? 'Guest' : 'Host'}:</strong> {isHost ? booking.guest.name : booking.host.name}
        </div>
        <div className="detail">
          <strong>Contact:</strong> {isHost ? booking.guest.contactNumber : booking.host.contactNumber}
        </div>
      </div>
      
      <div className="booking-actions">
        {isHost && booking.status === 'pending' && (
          <>
            <button className="btn" onClick={handleAccept}>Accept</button>
            <button className="btn btn-secondary" onClick={handleReject} style={{ marginLeft: '10px' }}>Reject</button>
          </>
        )}
        
        {isHost && booking.status === 'accepted' && (
          <button className="btn" onClick={handleComplete}>Mark as Completed</button>
        )}
        
        {(booking.status === 'pending' || booking.status === 'accepted') && (
          <button className="btn btn-danger" onClick={handleCancel} style={{ marginLeft: '10px' }}>
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard; 