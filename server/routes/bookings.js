const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getUserBookings, 
  getBookingById, 
  updateBookingStatus, 
  cancelBooking, 
  completeBooking 
} = require('../controllers/bookingController');
const { auth, hostOnly, guestOnly } = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private/Guest
router.post('/', auth, guestOnly, createBooking);

// @route   GET /api/bookings
// @desc    Get all bookings for current user
// @access  Private
router.get('/', auth, getUserBookings);

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, getBookingById);

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (host accepts or rejects)
// @access  Private/Host
router.put('/:id/status', auth, hostOnly, updateBookingStatus);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', auth, cancelBooking);

// @route   PUT /api/bookings/:id/complete
// @desc    Complete booking after meal
// @access  Private/Host
router.put('/:id/complete', auth, hostOnly, completeBooking);

module.exports = router; 