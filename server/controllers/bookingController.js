const Booking = require('../models/Booking');
const Meal = require('../models/Meal');
const User = require('../models/User');
const Notification = require('../models/Notification');
const notificationEmitter = require('../utils/notificationEmitter');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private/Guest
exports.createBooking = async (req, res) => {
  const { mealId, paymentId } = req.body;

  try {
    // Check if meal exists
    const meal = await Meal.findById(mealId).populate('host');
    if (!meal) {
      return res.status(404).json({ msg: 'Meal not found' });
    }

    // Check if meal is available
    if (!meal.isAvailable) {
      return res.status(400).json({ msg: 'Meal is not available for booking' });
    }

    // Check if meal serving time is in the future
    const now = new Date();
    const servingTime = new Date(meal.servingTime);
    const twoHoursBefore = new Date(servingTime.getTime() - 2 * 60 * 60 * 1000);
    
    if (now > twoHoursBefore) {
      return res.status(400).json({ 
        msg: 'Booking period closed. Bookings must be made at least 2 hours before serving time' 
      });
    }

    // Calculate admin cut (10% of payment amount)
    const adminCut = meal.price * 0.1;
    const hostAmount = meal.price - adminCut;

    // Create new booking
    const newBooking = new Booking({
      meal: mealId,
      guest: req.user.id,
      host: meal.host._id,
      paymentStatus: paymentId ? 'completed' : 'pending',
      paymentAmount: meal.price,
      paymentId,
      adminCut
    });

    // Save booking
    const booking = await newBooking.save();
    
    // Populate booking with meal and user details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('meal')
      .populate('guest', 'name email contactNumber')
      .populate('host', 'name email contactNumber');

    res.status(201).json(populatedBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all bookings for current user (guest or host)
// @route   GET /api/bookings
// @access  Private
exports.getUserBookings = async (req, res) => {
  try {
    let bookings;
    
    if (req.user.userType === 'guest') {
      // Get guest bookings
      bookings = await Booking.find({ guest: req.user.id })
        .populate('meal')
        .populate('host', 'name contactNumber')
        .sort({ bookingTime: -1 });
    } else {
      // Get host bookings
      bookings = await Booking.find({ host: req.user.id })
        .populate('meal')
        .populate('guest', 'name contactNumber')
        .sort({ bookingTime: -1 });
    }

    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('meal')
      .populate('guest', 'name email contactNumber')
      .populate('host', 'name email contactNumber');
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Check if user is guest or host of booking
    if (
      booking.guest._id.toString() !== req.user.id && 
      booking.host._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Update booking status (host accepts or rejects)
// @route   PUT /api/bookings/:id/status
// @access  Private/Host
exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  
  // Validate status
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }

  try {
    let booking = await Booking.findById(req.params.id)
      .populate('meal')
      .populate('guest');
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Check if user is host of booking
    if (booking.host.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Check if booking is in pending status
    if (booking.status !== 'pending') {
      return res.status(400).json({ msg: `Booking has already been ${booking.status}` });
    }

    // Update booking status
    booking.status = status;
    
    // If rejected, refund payment
    if (status === 'rejected' && booking.paymentStatus === 'completed') {
      booking.paymentStatus = 'refunded';
      booking.refundAmount = booking.paymentAmount;
      // TODO: Process actual refund through payment provider
    }

    // Save booking
    await booking.save();
    
    // Fetch updated booking with populated fields
    booking = await Booking.findById(req.params.id)
      .populate('meal')
      .populate('guest', 'name email contactNumber')
      .populate('host', 'name email contactNumber');

    // Emit booking status notification
    const notif = await Notification.create({
      user: booking.guest._id,
      message: status === 'accepted'
        ? `Your meal order for "${booking.meal.title}" is accepted and it will be delivered in the given time (${booking.meal.servingTime}).`
        : `Your meal order for "${booking.meal.title}" has been rejected or cancelled by the host.`,
      type: 'booking',
      meta: { mealTitle: booking.meal.title, servingTime: booking.meal.servingTime }
    });
    notificationEmitter.emit('newNotification', notif);

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id)
      .populate('meal');
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Check if user is guest or host of booking
    const isGuest = booking.guest.toString() === req.user.id;
    const isHost = booking.host.toString() === req.user.id;
    
    if (!isGuest && !isHost) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Check if booking can be cancelled
    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ msg: `Booking has already been ${booking.status}` });
    }

    // Set cancellation details
    booking.status = 'cancelled';
    booking.cancellationTime = new Date();
    booking.cancelledBy = isGuest ? 'guest' : 'host';

    // Determine if refund is needed
    const now = new Date();
    const servingTime = new Date(booking.meal.servingTime);
    const isBeforeServingTime = now < servingTime;
    
    // Refund logic
    if (booking.paymentStatus === 'completed') {
      if (isHost || isBeforeServingTime) {
        // Full refund if cancelled by host or if cancelled by guest before serving time
        booking.paymentStatus = 'refunded';
        booking.refundAmount = booking.paymentAmount;
        // TODO: Process actual refund through payment provider
      } else {
        // No refund if cancelled by guest after booking slot is over
        booking.refundAmount = 0;
      }
    }

    // Save booking
    await booking.save();
    
    // Fetch updated booking with populated fields
    booking = await Booking.findById(req.params.id)
      .populate('meal')
      .populate('guest', 'name email contactNumber')
      .populate('host', 'name email contactNumber');

    // Emit cancellation notification when host cancels
    if (booking.cancelledBy === 'host') {
      const cancelNotif = await Notification.create({
        user: booking.guest._id,
        message: `Your meal order for "${booking.meal.title}" has been cancelled by the host.`,
        type: 'booking',
        meta: { mealTitle: booking.meal.title, servingTime: booking.meal.servingTime }
      });
      notificationEmitter.emit('newNotification', cancelNotif);
    }

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Complete booking after meal
// @route   PUT /api/bookings/:id/complete
// @access  Private/Host
exports.completeBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Check if user is host of booking
    if (booking.host.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Check if booking is in accepted status
    if (booking.status !== 'accepted') {
      return res.status(400).json({ msg: `Cannot complete a booking that is ${booking.status}` });
    }

    // Update booking status
    booking.status = 'completed';
    
    // Save booking
    await booking.save();
    
    // Fetch updated booking with populated fields
    booking = await Booking.findById(req.params.id)
      .populate('meal')
      .populate('guest', 'name email contactNumber')
      .populate('host', 'name email contactNumber');

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}; 