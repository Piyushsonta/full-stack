const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from id
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }
    
    // Set user in request
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware to check if user is a host
const hostOnly = (req, res, next) => {
  if (req.user && req.user.userType === 'host') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Host only.' });
  }
};

// Middleware to check if user is a guest
const guestOnly = (req, res, next) => {
  if (req.user && req.user.userType === 'guest') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Guest only.' });
  }
};

module.exports = {
  auth,
  hostOnly,
  guestOnly
}; 