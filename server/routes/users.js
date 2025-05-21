const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getCurrentUser, 
  updateProfile, 
  getNearbyHosts 
} = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// @route   POST /api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/users/login
// @desc    Login user & get token
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, getCurrentUser);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateProfile);

// @route   GET /api/users/hosts/nearby
// @desc    Get hosts within radius
// @access  Private
router.get('/hosts/nearby', auth, getNearbyHosts);

module.exports = router; 