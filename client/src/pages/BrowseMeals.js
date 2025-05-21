import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import MealCard from '../components/meals/MealCard';
import MealFilter from '../components/meals/MealFilter';
import MapComponent from '../components/map/MapComponent';
import { useAuth } from '../context/AuthContext';
import dummyMeals from '../data/dummyMeals';


const BrowseMeals = () => {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentBookings, setCurrentBookings] = useState([]);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [isHost, setIsHost] = useState(false);

  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 100,
    cuisine: '',
    sortBy: 'price',
    withAccommodation: false
  });

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleViewMeal = useCallback((mealId) => {
    navigate(`/meals/${mealId}`);
  }, [navigate]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.delete(`/api/bookings/${bookingId}`);
      setCurrentBookings(prev => prev.filter(booking => booking._id !== bookingId));
    } catch (err) {
      console.error('Error canceling booking:', err);
    }
  };

  const fetchAllMeals = useCallback(async () => {
    try {
      console.log('Fetching meals for:', isAuthenticated ? `${user?.userType} user` : 'unauthenticated user');
      
      // Use the getActiveMeals endpoint to get meals with time-limited visibility
      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await axios.get(`/api/meals/active?_t=${timestamp}`);
      let mealsData = response.data?.meals || [];
      
      // Log the raw API response for debugging
      console.log('API response status:', response.status);
      console.log('API response data:', response.data);
      
      if (!Array.isArray(mealsData)) {
        console.error('API returned non-array for meals:', mealsData);
        setError('Unexpected API response: meals is not an array');
        setMeals([]);
        setLoading(false);
        return;
      }
      
      console.log('Active meals fetched:', mealsData.length);
      console.log('IMPORTANT: Real API meal data:', mealsData);
      
      if (mealsData.length === 0) {
        setError('No active meals available. Try hosting a meal or check back later.');
      }
      
      // Show all meals to all users (including hosts)
      console.log('Filtering: showing all meals regardless of host. Meals before filtering:', mealsData.length);
      const filteredMeals = mealsData;
      console.log('Meals after filtering:', filteredMeals.length);
      
      // Add time remaining and expiry info to each meal
      const mealsWithTimeInfo = filteredMeals.map(meal => ({
        ...meal,
        timeRemaining: meal.timeRemaining || 'Limited time',
        isExpiringSoon: meal.isExpiringSoon || false
      }));
      
      setMeals(mealsWithTimeInfo);
      setFilteredMeals(mealsWithTimeInfo);
      setLoading(false);
      console.log('Meals after fetch and transform:', mealsWithTimeInfo);
    } catch (err) {
      console.error('Error fetching active meals:', err);
      
      // Log the specific error
      console.error('API error details:', err.response?.data || 'No response data');
      
      // Create a single debug dummy meal to indicate there was an error
      const errorDummyMeal = {
        ...dummyMeals[0],
        _id: 'error_meal',
        name: 'Error Loading Meals',
        description: `There was an error loading meals: ${err.message}. Please try again later or contact support.`,
        isDummyMeal: true
      };
      
      setMeals([errorDummyMeal]);
      setFilteredMeals([errorDummyMeal]);
      setError('Unable to load meals. Please check console for details.');
      setLoading(false);
    }
  }, [isHost, user]);

  const fetchNearbyMeals = useCallback(async (longitude, latitude) => {
    try {
      console.log('Fetching nearby meals with coordinates:', longitude, latitude);

      // Try to get ALL active meals first through the active endpoint, which is more reliable
      const activeResponse = await axios.get('/api/meals/active');
      let allMeals = activeResponse.data?.meals || [];
      console.log('Successfully fetched active meals before trying nearby:', allMeals.length);
      
      // Now try to fetch nearby meals
      const response = await axios.get(`/api/meals/nearby?longitude=${longitude}&latitude=${latitude}`);
      let nearbyMeals = response.data || [];
      console.log('Nearby meals API response length:', nearbyMeals.length);
      
      // CRITICAL: Always prioritize REAL meals, never use dummy meals if we have real ones
      let mealsData = nearbyMeals.length > 0 ? nearbyMeals : allMeals;
      
      // Only if we have NO real meals at all should we consider a placeholder
      if (mealsData.length === 0) {
        console.log('No real meals found even after checking both endpoints');
        
        // Create one placeholder meal with nearby coordinates
        const placeholderMeal = {
          _id: 'no_meals_nearby',
          name: 'No Meals Available Nearby',
          description: 'There are currently no meals available in your area. Please check back later!',
          price: 0,
          image: 'https://via.placeholder.com/400x200?text=No+Nearby+Meals',
          isDummyMeal: true,
          location: {
            address: 'Near your location',
            coordinates: [
              longitude + (Math.random() * 0.01 - 0.005), // Small random offset
              latitude + (Math.random() * 0.01 - 0.005)   // Small random offset
            ]
          }
        };
        
        mealsData = [placeholderMeal];
      }
      
      const filteredMeals = mealsData;
      setMeals(filteredMeals);
      setFilteredMeals(filteredMeals);
      
      // Create map markers for all meals (defensive: only those with valid coordinates)
      setMapMarkers(filteredMeals
        .filter(meal => meal.location && Array.isArray(meal.location.coordinates) && meal.location.coordinates.length === 2)
        .map(meal => ({
          id: meal._id,
          position: [meal.location.coordinates[1], meal.location.coordinates[0]],
          title: meal.title,
          popupContent: (
            <div>
              <h4>{meal.title}</h4>
              <p>{meal.description.substring(0, 100)}...</p>
              <p>Price: ₹{meal.price.toFixed(2)}</p>
              <button onClick={() => handleViewMeal(meal._id)}>View Details</button>
            </div>
          )
        }))
      );
    } catch (err) {
      console.error('Error fetching meals:', err);
      
      // If error occurs and user is a guest, show dummy data instead
      if (!isHost) {
        // Create localized dummy meals
        const localizedDummyMeals = dummyMeals.map(meal => ({
          ...meal,
          location: {
            ...meal.location,
            coordinates: [
              longitude + (Math.random() * 0.02 - 0.01),
              latitude + (Math.random() * 0.02 - 0.01)
            ]
          }
        }));
        
        setMeals(localizedDummyMeals);
        setFilteredMeals(localizedDummyMeals);
        
        // Create map markers for dummy meals
        setMapMarkers(localizedDummyMeals.map(meal => ({
          id: meal._id,
          position: [meal.location.coordinates[1], meal.location.coordinates[0]],
          title: meal.title,
          popupContent: (
            <div>
              <h4>{meal.title}</h4>
              <p>{meal.description.substring(0, 100)}...</p>
              <p>Price: ₹{meal.price.toFixed(2)}</p>
              <button onClick={() => handleViewMeal(meal._id)}>View Details</button>
            </div>
          )
        })));
        
        setError(null); // Clear error since we're showing dummy data
      } else {
        setMeals([]);
        setFilteredMeals([]);
        setError('Error fetching meals. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [isHost, user, handleViewMeal]);

  const fetchUserBookings = useCallback(async () => {
    try {
      const response = await axios.get('/api/bookings');
      const activeBookings = response.data.filter(
        booking => new Date(booking.date) >= new Date()
      );
      setCurrentBookings(activeBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  }, []);

  useEffect(() => {
    setIsHost(user?.role === 'host');
    
    // Always fetch all meals first to ensure we have something to display
    fetchAllMeals();
    
    // Get user's location for nearby meals
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setLoading(true);
          
          // Fetch nearby meals based on location
          fetchNearbyMeals(longitude, latitude);
          
          if (isAuthenticated) {
            fetchUserBookings();
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enable location services.');
          // We already called fetchAllMeals above, so no need to call it again
        }
      );
    }
  }, [fetchAllMeals, fetchNearbyMeals, fetchUserBookings, isAuthenticated, user]);

  useEffect(() => {
    fetchAllMeals();
  }, [fetchAllMeals]);

  useEffect(() => {
    setFilteredMeals(meals);
  }, [meals]);

  // Order Modal State
  const [orderModal, setOrderModal] = useState({ open: false, meal: null });

  // Place Order Handler
  const handlePlaceOrder = async (meal) => {
    console.log('handlePlaceOrder called for meal:', meal._id);
    try {
      const response = await axios.post('/api/bookings', { mealId: meal._id });
      console.log('Booking created:', response.data);
      setCurrentBookings(prev => [...prev, response.data]);
      const target = `/payment/${response.data._id}`;
      // Try router navigate, fallback to full redirect
      try {
        navigate(target);
      } catch (navErr) {
        console.warn('navigate failed, falling back to window.location:', navErr);
        window.location.href = target;
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Unable to place order: ' + (err.response?.data?.msg || err.message));
    }
  };
  const handleCloseOrderModal = () => setOrderModal({ open: false, meal: null });

  console.log('Rendering filteredMeals:', filteredMeals);
  return (
    <div className="container py-4">
      {/* Error Message */}
      {error && (
        <div className="alert alert-danger text-center" style={{ marginBottom: 20 }}>
          {error}
        </div>
      )}
      {/* Order Modal */}
      {orderModal.open && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
          <div className="modal-content" style={{ maxWidth: 400, textAlign: 'center' }}>
            <div className="modal-header">
              <h3 className="modal-title">Order Placed!</h3>
              <button className="close-btn" onClick={handleCloseOrderModal}>&times;</button>
            </div>
            <div style={{ padding: '20px 0' }}>
              <i className="fas fa-check-circle text-success mb-3" style={{ fontSize: '2.5rem' }}></i>
              <p className="mb-2">Your order for <strong>{orderModal.meal?.title}</strong> has been placed.</p>
              <p>Estimated delivery: <strong>{orderModal.meal?.estimatedDelivery || '30-45'} min</strong></p>
              <button className="btn btn-primary mt-2" onClick={handleCloseOrderModal}>Close</button>
            </div>
          </div>
        </div>
      )}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{isHost ? 'Host Meals' : 'Browse & Manage Meals'}</h1>
        {isHost && (
          <Link to="/host/meal" className="btn btn-primary">
            Add New Meal
          </Link>
        )}
      </div>

      {/* Meals Grid */}
      <div className="browse-meal-grid mb-4">
        {filteredMeals.map(meal => (
          <div key={meal._id} className="browse-meal-card-wrapper">
            <MealCard
              meal={meal}
              onViewDetails={mealId => {
                try {
                  navigate(`/meals/${mealId}`);
                } catch (e) {
                  setError('Navigation error: ' + e.message);
                }
              }}
              onPlaceOrder={async (meal) => {
                try {
                  await handlePlaceOrder(meal);
                } catch (e) {
                  setError('Order error: ' + e.message);
                }
              }}
              isBooked={currentBookings.some(booking => booking.mealId === meal._id)}
              onCancelBooking={handleCancelBooking}
              currentBooking={currentBookings.find(booking => booking.mealId === meal._id)}
            />
          </div>
        ))}
      </div>
      <div className="browse-meal-map-container">
        <MapComponent
          center={userLocation || [40.7128, -74.0060]} // fallback to NYC
          markers={mapMarkers}
          zoom={12}
        />
      </div>

      {/* No meals found message */}
      {filteredMeals.length === 0 && !error && (
        <div className="text-center mt-4">
          <p>No meals found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseMeals;
