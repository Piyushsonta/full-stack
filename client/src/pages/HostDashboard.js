import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import BookingCard from '../components/bookings/BookingCard';
import MealForm from '../components/meals/MealForm';
import { useAuth } from '../context/AuthContext';
import dummyMeals from '../data/dummyMeals';

const HostDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMealForm, setShowMealForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    try {
      fetchBookings();
      fetchMeals();
    } catch (e) {
      setLoading(false);
      alert('Dashboard error: ' + e.message);
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeals = async () => {
    setLoading(true);
    try {
      // Force the GET request to bypass cache with timestamp
      const timestamp = new Date().getTime();
      const res = await axios.get(`/api/meals/host?t=${timestamp}`);
      
      console.log('Host meals fetched:', res.data);
      
      if (Array.isArray(res.data) && res.data.length > 0) {
        console.log(`✅ Successfully fetched ${res.data.length} meals`);
        setMeals(res.data);
      } else {
        console.log('⚠️ No meals returned from server, checking for issues');
        // Add a second attempt with direct backend URL in case of routing issues
        try {
          const retryRes = await axios.get('/api/meals/host/direct');
          if (Array.isArray(retryRes.data) && retryRes.data.length > 0) {
            console.log(`✅ Retry successful: ${retryRes.data.length} meals`);
            setMeals(retryRes.data);
          } else {
            throw new Error('No meals found in retry');
          }
        } catch (retryErr) {
          console.error('Retry also failed:', retryErr);
          // Fallback to dummy data as last resort
          if (user) {
            console.log('Using dummy meal data as fallback');
            const dummyHostMeals = dummyMeals.map(meal => ({
              ...meal,
              _id: `dummy_${Math.random().toString(36).substring(7)}`,
              host: user._id,
              isActive: true,
              visibleToGuests: true,
              timeRemaining: '24 hours'
            }));
            setMeals(dummyHostMeals);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching meals:', err);
      // Use dummy meals as fallback for demo/development
      if (user) {
        console.log('Using dummy meal data after error');
        const dummyHostMeals = dummyMeals.map(meal => ({
          ...meal,
          _id: `dummy_${Math.random().toString(36).substring(7)}`,
          host: user._id,
          isActive: true,
          visibleToGuests: true,
          timeRemaining: '24 hours'
        }));
        setMeals(dummyHostMeals);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookingStatusChange = (updatedBooking) => {
    setBookings(bookings.map(booking => 
      booking._id === updatedBooking._id ? updatedBooking : booking
    ));
  };

  const handleAddMeal = () => {
    setEditingMeal(null);
    setShowMealForm(true);
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setShowMealForm(true);
  };

  const handleMealSubmit = async (formData) => {
    try {
      if (editingMeal) {
        // Update existing meal
        await axios.put(`/api/meals/${editingMeal._id}`, formData);
      } else {
        // Create new meal
        await axios.post('/api/meals', formData);
      }
      
      // Refresh meals list
      fetchMeals();
      setShowMealForm(false);
    } catch (err) {
      console.error('Error saving meal:', err);
      alert('Error saving meal. Please try again.');
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await axios.delete(`/api/meals/${mealId}`);
        fetchMeals();
      } catch (err) {
        console.error('Error deleting meal:', err);
        alert('Error deleting meal. It may have active bookings.');
      }
    }
  };

  const handleCloseMealForm = () => {
    setShowMealForm(false);
  };

  // Filter bookings by status
  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  const activeBookings = bookings.filter(booking => booking.status === 'accepted');
  const pastBookings = bookings.filter(booking => 
    ['completed', 'cancelled', 'rejected'].includes(booking.status)
  );

  return (
    <div className="container">
      <div className="section-title" style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
        <i className="fas fa-utensils" style={{ fontSize: '24px', marginRight: '10px' }}></i>
        <h1>Hosted Meal</h1>
      </div>
      <p>Welcome, {user?.name}! Manage your hosted meals below.</p>
      
      {/* Booking Requests Section */}
      <div className="booking-requests-section">
        <h2>Booking Requests</h2>
        {loading ? (
          <p>Loading booking requests...</p>
        ) : pendingBookings.length === 0 ? (
          <p>No pending booking requests.</p>
        ) : (
          pendingBookings.map(booking => (
            <BookingCard 
              key={booking._id} 
              booking={booking}
              onStatusChange={handleBookingStatusChange}
            />
          ))
        )}
      </div>
      
      <div className="divider"></div>
      
      {/* Active Bookings Section */}
      {activeBookings.length > 0 && (
        <div className="active-bookings-section">
          <h2>Active Bookings</h2>
          {activeBookings.map(booking => (
            <BookingCard 
              key={booking._id} 
              booking={booking}
              onStatusChange={handleBookingStatusChange}
            />
          ))}
          <div className="divider"></div>
        </div>
      )}
      
      {/* Meal Management Section */}
      <div className="meal-management-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Your Meals</h2>
          <button 
            className="btn"
            onClick={handleAddMeal}
          >
            Add New Meal
          </button>
        </div>
        
        {loading ? (
          <p>Loading meals...</p>
        ) : meals.length === 0 ? (
          <p>You haven't created any meals yet. Click 'Add New Meal' to get started.</p>
        ) : (
          <div className="meals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {meals.map(meal => (
              <div key={meal._id} className="card" style={{ padding: '15px', position: 'relative' }}>
                {meal.visibleToGuests ? (
                  <span className="badge bg-success" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}>
                    Visible to Guests
                  </span>
                ) : (
                  <span className="badge bg-secondary" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}>
                    Not Visible
                  </span>
                )}
                <img 
                  src={meal.image} 
                  alt={meal.name} 
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <h3>{meal.name}</h3>
                <p>${typeof meal.price === 'number' ? meal.price.toFixed(2) : meal.price}</p>
                <p>
                  <strong>Serving Time:</strong> {format(new Date(meal.servingTime), 'PPp')}
                </p>
                <p>
                  <strong>Status:</strong> {meal.isActive ? 'Active' : 'Inactive'}
                </p>
                {meal.timeRemaining && (
                  <p>
                    <strong>Visible for:</strong> <span className={meal.isExpiringSoon ? 'text-danger' : ''}>{meal.timeRemaining}</span>
                  </p>
                )}
                <p>
                  <strong>Servings:</strong> {meal.remainingServings} / {meal.maxServings}
                </p>
                <p>
                  <strong>Orders:</strong> {meal.totalOrders || 0}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <button 
                    className="btn" 
                    onClick={() => handleEditMeal(meal)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteMeal(meal._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Past Bookings Section */}
      {pastBookings.length > 0 && (
        <div className="past-bookings-section" style={{ marginTop: '30px' }}>
          <h2>Past Bookings</h2>
          <div className="bookings-list">
            {pastBookings.map(booking => (
              <div key={booking._id} className="card" style={{ padding: '15px', marginBottom: '15px' }}>
                <h3>{booking.meal.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>
                    <strong>Date:</strong> {format(new Date(booking.meal.servingTime), 'PPp')}
                  </span>
                  <span className={`status status-${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>
                <p>
                  <strong>Guest:</strong> {booking.guest.name}
                </p>
                <p>
                  <strong>Price:</strong> ${booking.paymentAmount.toFixed(2)}
                </p>
                {booking.status === 'cancelled' && booking.cancelledBy && (
                  <p>
                    <strong>Cancelled by:</strong> {booking.cancelledBy}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Meal Form Modal */}
      {showMealForm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingMeal ? 'Edit Meal' : 'Add New Meal'}</h3>
              <button className="close-btn" onClick={handleCloseMealForm}>&times;</button>
            </div>
            <div className="modal-body">
              <MealForm 
                initialData={editingMeal}
                onSubmit={handleMealSubmit}
                buttonText={editingMeal ? 'Update Meal' : 'Create Meal'}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostDashboard; 