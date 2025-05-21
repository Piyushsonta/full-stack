const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['guest', 'host'],
    required: true
  },
  bankDetails: {
    accountNumber: {
      type: String,
      required: function() { return this.userType === 'host'; }
    },
    bankName: {
      type: String,
      required: function() { return this.userType === 'host'; }
    }
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    },
    address: {
      type: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for geospatial queries
UserSchema.index({ location: '2dsphere' });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 