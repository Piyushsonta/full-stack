import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MapComponent from '../components/map/MapComponent';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [nearbyHosts, setNearbyHosts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const [isHost, setIsHost] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is a host
    if (user) {
      setIsHost(user.userType === 'host');
    }

    // Get user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        
        if (isAuthenticated) {
          fetchNearbyHosts(longitude, latitude);
        } else {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setLoading(false);
      }
    );
  }, [isAuthenticated, user]);

  const fetchNearbyHosts = async (longitude, latitude) => {
    try {
      const res = await axios.get(`/api/users/hosts/nearby?longitude=${longitude}&latitude=${latitude}&radius=3`);
      setNearbyHosts(res.data);
    } catch (err) {
      console.error('Error fetching nearby hosts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExplore = () => {
    if (isHost) {
      navigate('/host/meal');
    } else {
      navigate('/browse');
    }
  };

  // Prepare markers for the map
  const mapMarkers = nearbyHosts.map(host => ({
    location: host.location,
    popupContent: (
      <div>
        <h4>{host.name}</h4>
        <p>Host available for homemade meals</p>
      </div>
    )
  }));

  return (
    <div className="home">
      <section className="hero">
        {/* Decorative food elements */}
        <div className="food-element"></div>
        <div className="food-element"></div>
        <div className="food-element"></div>
        
        <div className="hero-content">
          <h1 className="hero-title" data-aos="fade-up">
            Enjoy Your Time Here
          </h1>
          <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="200">
            Discover delicious homemade meals and connect with amazing hosts
          </p>
          {!isAuthenticated && (
            <div className="hero-buttons" data-aos="fade-up" data-aos-delay="400">
              <Link to="/register" className="btn btn-register">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outlined">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header text-center" data-aos="fade-up">
            <h2>Why Choose HomeMeal?</h2>
            <p>Experience the unique benefits of home-cooked meals shared with passion</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <h3>Authentic Home Cooking</h3>
              <p>Taste real, homemade dishes prepared with care and authentic recipes passed down through generations.</p>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Connect With Locals</h3>
              <p>Share meals and stories with local hosts, creating meaningful connections and cultural experiences.</p>
            </div>
            
            <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Discover Your Neighborhood</h3>
              <p>Find amazing cooks right in your area and explore the culinary diversity of your community.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="map-section-container">
        <div className="container">
          <div className="section-header text-center" data-aos="fade-up">
            <h2>Find Your Closest Meals</h2>
            <p>Delicious homemade food is just around the corner</p>
          </div>
          
          {loading ? (
            <p className="text-center">Loading nearby hosts...</p>
          ) : (
            <div className="map-wrapper" data-aos="fade-up">
              {isAuthenticated ? (
                <>
                  <p>Explore hosts within 3km of your location:</p>
                  <MapComponent 
                    markers={mapMarkers} 
                    center={userLocation}
                  />
                </>
              ) : (
                <div className="login-prompt text-center">
                  <p>Login to see hosts near you and book your next homemade meal experience.</p>
                  <div className="prompt-buttons">
                    <Link to="/login" className="btn btn-register">Sign In</Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header text-center" data-aos="fade-up">
            <h2>How HomeMeal Works</h2>
            <p>Connecting food lovers with passionate home cooks in three simple steps</p>
          </div>
          
          <div className="steps-container">
            <div className="step" data-aos="fade-up" data-aos-delay="100">
              <div className="step-number">1</div>
              <h3>Browse Available Meals</h3>
              <p>Search for meals available in your area, filter by cuisine, dietary needs, or date.</p>
            </div>
            
            <div className="step" data-aos="fade-up" data-aos-delay="200">
              <div className="step-number">2</div>
              <h3>Book Your Experience</h3>
              <p>Select a meal and book your spot. Communicate with the host about any special requests.</p>
            </div>
            
            <div className="step" data-aos="fade-up" data-aos-delay="300">
              <div className="step-number">3</div>
              <h3>Enjoy Your Meal</h3>
              <p>Visit your host's home, enjoy authentic food, and share stories around the table.</p>
            </div>
          </div>
          
          <div className="cta-container text-center" data-aos="fade-up">
            {isHost ? (
              <Link to="/host/meal" className="btn btn-register btn-lg">Host Meal Now</Link>
            ) : (
              <Link to="/browse" className="btn btn-register btn-lg">Browse Meals Now</Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 