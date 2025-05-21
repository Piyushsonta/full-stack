const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snacks', 'dessert']
  },
  cuisine: {
    type: String,
    required: true,
    enum: ['indian', 'chinese', 'italian', 'mexican', 'thai', 'japanese', 'american', 'other']
  },
  dietaryPreferences: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'halal', 'kosher']
  }],
  spicyLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'extra-hot'],
    default: 'medium'
  },
  ingredients: [{
    type: String,
    required: true
  }],
  servingTime: {
    type: Date,
    required: true
  },
  expiryTime: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  maxServings: {
    type: Number,
    required: true,
    min: 1
  },
  remainingServings: {
    type: Number,
    min: 0
  },
  preparationTime: {
    type: Number, // in minutes
    required: true,
    min: 0
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'sold_out'],
    default: 'active'
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  totalOrders: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Pre-save middleware to set initial remaining servings
mealSchema.pre('save', function(next) {
  if (this.isNew) {
    this.remainingServings = this.maxServings;
  }
  next();
});

// Create TTL index for automatic deletion after expiry
mealSchema.index({ expiryTime: 1 }, { expireAfterSeconds: 0 });

// Instance method to check if meal is available
mealSchema.methods.isAvailable = function() {
  const now = new Date();
  return (
    this.status === 'active' &&
    this.remainingServings > 0 &&
    now >= this.servingTime &&
    now <= this.expiryTime
  );
};

// Static method to find active meals
mealSchema.statics.findActiveMeals = function() {
  const now = new Date();
  return this.find({
    status: 'active',
    remainingServings: { $gt: 0 },
    servingTime: { $lte: now },
    expiryTime: { $gt: now }
  }).populate('host', 'name rating');
};

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal; 