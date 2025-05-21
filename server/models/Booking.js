const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  meal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal',
    required: true
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: [
      'pending',
      'accepted',
      'rejected',
      'cancelled',
      'completed',
      'pending_payment_confirmation',
      'payment_received'
    ],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded', 'upi_pending', 'upi_confirmed'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number,
    required: true
  },
  paymentId: {
    type: String
  },
  adminCut: {
    type: Number,
    default: 0
  },
  bookingTime: {
    type: Date,
    default: Date.now
  },
  cancellationTime: {
    type: Date
  },
  cancelledBy: {
    type: String,
    enum: ['guest', 'host', null],
    default: null
  },
  refundAmount: {
    type: Number,
    default: 0
  }
});

// Validate booking times according to rules
BookingSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Get the meal information
      const Meal = mongoose.model('Meal');
      const meal = await Meal.findById(this.meal);
      
      if (!meal) {
        return next(new Error('Meal not found'));
      }
      
      const now = new Date();
      const servingTime = new Date(meal.servingTime);
      const twoHoursBefore = new Date(servingTime.getTime() - 2 * 60 * 60 * 1000);
      
      // Check if booking is being made at least 2 hours before serving time
      if (now > twoHoursBefore) {
        return next(new Error('Bookings must be made at least 2 hours before serving time'));
      }
      
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Booking', BookingSchema); 