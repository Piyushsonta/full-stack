import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseMeals from './pages/BrowseMeals';
import MealDetails from './pages/MealDetails';
import GuestDashboard from './pages/GuestDashboard';
import HostDashboard from './pages/HostDashboard';
import HostMeal from './pages/HostMeal';
import TestPage from './pages/TestPage';
import Profile from './pages/Profile';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/auth/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import './styles/App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentMethod from './pages/PaymentMethod';

// Protected route component
const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, loading } = useAuth();
  
  // Show loading while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // If role is required and user doesn't have it, redirect to appropriate dashboard
  if (requiredRole && user.userType !== requiredRole) {
    return <Navigate to={user.userType === 'host' ? '/host-dashboard' : '/guest-dashboard'} />;
  }
  console.log('Rendering protected route:', requiredRole, 'for user:', user);
  
  // Otherwise, render the protected component
  return element;
};

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main className="content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/browse" element={<BrowseMeals />} />
            <Route path="/meals/:id" element={<MealDetails />} />
            <Route path="/test" element={<TestPage />} />
            
            {/* Protected routes */}
            <Route 
              path="/guest-dashboard" 
              element={<ProtectedRoute element={<GuestDashboard />} requiredRole="guest" />} 
            />
            <Route 
              path="/host-dashboard" 
              element={<ProtectedRoute element={<HostDashboard />} requiredRole="host" />} 
            />
            <Route path="/host/meal" element={<HostMeal />} />
            <Route 
              path="/profile" 
              element={<ProtectedRoute element={<Profile />} />} 
            />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route path="/payment/:bookingId" element={<PaymentMethod />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
}

export default App; 