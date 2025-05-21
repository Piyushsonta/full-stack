import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    totalMeals: 0,
    totalBookings: 0,
    revenue: 0,
    pendingOrders: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [popularMeals, setPopularMeals] = useState([]);

  useEffect(() => {
    console.log('Dashboard mounted');
    console.log('User:', user);
    console.log('Loading:', loading);

    // In a real app, these would be API calls
    // For now, using sample data
    setStats({
      totalMeals: 24,
      totalBookings: 156,
      revenue: 3240,
      pendingOrders: 8
    });

    setRecentBookings([
      {
        id: 1,
        customerName: "John Doe",
        mealName: "Homestyle Pasta",
        date: "2024-03-20",
        status: "pending",
        amount: 25.99
      },
      {
        id: 2,
        customerName: "Alice Smith",
        mealName: "Vegetarian Curry",
        date: "2024-03-19",
        status: "completed",
        amount: 18.50
      },
      {
        id: 3,
        customerName: "Bob Wilson",
        mealName: "Grilled Salmon",
        date: "2024-03-19",
        status: "pending",
        amount: 32.00
      }
    ]);

    setPopularMeals([
      {
        id: 1,
        name: "Classic Italian Pasta",
        orders: 45,
        rating: 4.8,
        revenue: 1125
      },
      {
        id: 2,
        name: "Homemade Pizza",
        orders: 38,
        rating: 4.7,
        revenue: 950
      },
      {
        id: 3,
        name: "Asian Stir Fry",
        orders: 32,
        rating: 4.9,
        revenue: 800
      }
    ]);
  }, [user, loading]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="loading-container">
        <p>Please log in to view the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section" data-aos="fade-up">
        <h1>Welcome back, {user?.name || 'Chef'}! 👋</h1>
        <p>Here's what's happening with your meals today.</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid" data-aos="fade-up">
        <div className="stat-card">
          <i className="fas fa-utensils"></i>
          <h3>Active Meals</h3>
          <p>{stats.totalMeals}</p>
          <span className="stat-subtitle">Listed on Platform</span>
        </div>
        <div className="stat-card">
          <i className="fas fa-shopping-cart"></i>
          <h3>Total Orders</h3>
          <p>{stats.totalBookings}</p>
          <span className="stat-subtitle">All Time</span>
        </div>
        <div className="stat-card">
          <i className="fas fa-dollar-sign"></i>
          <h3>Revenue</h3>
          <p>${stats.revenue}</p>
          <span className="stat-subtitle">This Month</span>
        </div>
        <div className="stat-card">
          <i className="fas fa-clock"></i>
          <h3>Pending</h3>
          <p>{stats.pendingOrders}</p>
          <span className="stat-subtitle">Orders to Process</span>
        </div>
      </div>

      <div className="dashboard-grid" data-aos="fade-up">
        {/* Recent Bookings */}
        <div className="dashboard-card recent-bookings">
          <h2>Recent Bookings</h2>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Meal</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.filter(booking => booking && typeof booking === 'object').map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.customerName || 'N/A'}</td>
                    <td>{booking.mealName || 'N/A'}</td>
                    <td>{booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}</td>
                    <td>{typeof booking.amount === 'number' ? `$${booking.amount.toFixed(2)}` : 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Meals */}
        <div className="dashboard-card popular-meals">
          <h2>Popular Meals</h2>
          <div className="meals-list">
            {popularMeals.filter(meal => meal && typeof meal === 'object').map(meal => (
              <div key={meal.id} className="popular-meal-item">
                <div className="meal-info">
                  <h3>{meal.name || 'N/A'}</h3>
                  <div className="meal-stats">
                    <span><i className="fas fa-shopping-cart"></i> {typeof meal.orders === 'number' ? meal.orders : 'N/A'} orders</span>
                    <span><i className="fas fa-star"></i> {typeof meal.rating === 'number' ? meal.rating : 'N/A'}</span>
                    <span><i className="fas fa-dollar-sign"></i> {typeof meal.revenue === 'number' ? `$${meal.revenue}` : 'N/A'}</span>
                  </div>
                </div>
                <div className="meal-chart">
                  {/* Add a simple bar to represent popularity */}
                  <div 
                    className="popularity-bar" 
                    style={{ width: `${(typeof meal.orders === 'number' && meal.orders > 0 ? (meal.orders / 45) * 100 : 0)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 