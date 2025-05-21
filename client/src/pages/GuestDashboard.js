import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import BookingCard from '../components/bookings/BookingCard';
import OrderNotification from '../components/notifications/OrderNotification';
import BookingStatusNotification from '../components/notifications/BookingStatusNotification';
import MapComponent from '../components/map/MapComponent';
import { useAuth } from '../context/AuthContext';
import dummyMeals from '../data/dummyMeals';

const GuestDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [nearbyMeals, setNearbyMeals] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
const [error, setError] = useState(null);

  useEffect(() => {
    try {
      fetchBookings();
      fetchNotifications();
    } catch (e) {
      setLoading(false);
      setError('Error loading bookings: ' + e.message);
    }
    
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          fetchNearbyMeals(longitude, latitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    } catch (e) {
      setError('Location error: ' + e.message);
      setLoading(false);
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data.filter(n => n.type === 'booking' && ['accepted','rejected'].includes(n.message.toLowerCase().includes('accepted') ? 'accepted' : n.message.toLowerCase().includes('rejected') ? 'rejected' : '')));
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

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

  const fetchNearbyMeals = async (longitude, latitude) => {
    try {
      const res = await axios.get(`/api/meals/nearby?longitude=${longitude}&latitude=${latitude}&radius=3`);
      setNearbyMeals(res.data);
    } catch (err) {
      console.error('Error fetching nearby meals:', err);
      // Use dummy meals as fallback for demo/development
      setNearbyMeals(dummyMeals);
    }
  };

  const handleBookingStatusChange = (updatedBooking) => {
    setBookings(bookings.map(booking => 
      booking._id === updatedBooking._id ? updatedBooking : booking
    ));
  };

  // Filter active bookings (pending or accepted)
  const activeBookings = bookings.filter(booking => 
    ['pending', 'accepted'].includes(booking.status)
  );

  // Filter past bookings (completed, cancelled, rejected)
  const pastBookings = bookings.filter(booking => 
    ['completed', 'cancelled', 'rejected'].includes(booking.status)
  );

  // Prepare notifications for OrderNotification
  // Use notifications from backend if available, fallback to bookings if not
  const notificationBookings = notifications.length > 0
    ? notifications.map(n => ({
        status: n.message.toLowerCase().includes('accept') ? 'accepted'
              : n.message.toLowerCase().includes('reject') ? 'rejected'
              : n.message.toLowerCase().includes('cancel') ? 'cancelled'
              : '',
        meal: {
          title: n.meta && n.meta.mealTitle ? n.meta.mealTitle : '',
          servingTime: n.meta && n.meta.servingTime ? n.meta.servingTime : null
        },
        _id: n._id
      }))
    : bookings;

  // Filter meals based on search term
  const filteredMeals = nearbyMeals.filter(meal => 
    meal && typeof meal === 'object' &&
    meal.title && meal.description &&
    (
      meal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Prepare markers for the map
  const mapMarkers = nearbyMeals
    .filter(meal => meal && meal.location && Array.isArray(meal.location.coordinates) && meal.location.coordinates.length === 2 && meal.title && meal.price)
    .map(meal => ({
      location: meal.location,
      popupContent: (
        <div>
          <h4>{meal.title}</h4>
          <p>${meal.price.toFixed(2)}</p>
          <Link to={`/meals/${meal._id}`} className="btn" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>
            View Details
          </Link>
        </div>
      )
    }));

  // Only show order notifications for guest users
  const acceptedBookings = bookings.filter(b => b.status === 'accepted');

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <BookingStatusNotification notifications={notifications} />
      <OrderNotification bookings={notificationBookings} />
      <div className="guest-dashboard container" style={{ marginTop: '30px' }}>
        <h1 style={{ marginBottom: '24px' }}>Welcome, {user && user.name ? user.name : 'Guest'}!</h1>
        <div className="search-bar" style={{ marginBottom: '30px' }}>
          <input 
            type="text"
            className="form-control"
            placeholder="Search for meals by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px', fontSize: '1rem' }}
          />
        </div>
      </div>
      
      {/* Active Bookings */}
      {activeBookings.length > 0 && (
        <div className="active-bookings-section">
          <h2>Your Current Bookings</h2>
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
      
      {/* Map of nearby meals */}
      <div className="map-section">
        <h2>Meals in Your Area</h2>
        {loading ? (
          <p>Loading map...</p>
        ) : (
          <>
            <MapComponent 
              markers={mapMarkers} 
              center={userLocation}
            />
            <p className="text-muted" style={{ marginTop: '10px' }}>
              Click on markers to see available meals near you
            </p>
          </>
        )}
      </div>
      
      {/* Filtered meals list */}
      <div className="meals-section" style={{ marginTop: '30px' }}>
        <h2>Available Meals</h2>
        {loading ? (
          <p>Loading meals...</p>
        ) : filteredMeals.length === 0 ? (
          <p>No meals match your search criteria. Try a different search term.</p>
        ) : (
          <div className="meals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredMeals
              .filter(meal => meal && typeof meal === 'object')
              .map(meal => (
                <div key={meal._id} className="card" style={{ padding: '15px' }}>
                  <img src={meal.image} alt={meal.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                  <h3>{meal.title}</h3>
                  <p>${meal.price.toFixed(2)}</p>
                  <p>{format(new Date(meal.servingTime), 'PPp')}</p>
                  <Link to={`/meals/${meal._id}`} className="btn">
                    View Details
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>
      
      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div className="past-bookings-section" style={{ marginTop: '30px' }}>
          <h2>Past Bookings</h2>
          <div className="bookings-list">
            {pastBookings.filter(booking => booking && booking.meal && booking.meal.title).map(booking => (
              <div key={booking._id} className="card" style={{ padding: '15px', marginBottom: '15px' }}>
                <h3>{booking.meal.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>
                    <strong>Date:</strong> {booking.meal.servingTime ? format(new Date(booking.meal.servingTime), 'PPp') : 'N/A'}
                  </span>
                  <span className={`status status-${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>
                <p>
                  <strong>Host:</strong> {booking.host && booking.host.name ? booking.host.name : 'N/A'}
                </p>
                <p>
                  <strong>Price:</strong> {booking.paymentAmount ? `$${booking.paymentAmount.toFixed(2)}` : 'N/A'}
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
    </div>
  );
};

export default GuestDashboard; 