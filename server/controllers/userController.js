
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { 
    name, 
    email, 
    password, 
    age, 
    contactNumber, 
    userType, 
    bankDetails,
    location 
  } = req.body;

  // Validate required fields
  if (!name || !email || !password || !age || !contactNumber || !userType) {
    return res.status(400).json({ msg: 'Please fill in all required fields' });
  }

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      age,
      contactNumber,
      userType,
      bankDetails,
      location
    });

    // Save user
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) {
          console.error('JWT sign error:', err.message);
          return res.status(500).json({ msg: 'Error generating token' });
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials', message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials', message: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            userType: user.userType
          } 
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error', message: 'Server error' });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  const {
    name,
    contactNumber,
    bankDetails,
    location
  } = req.body;

  // Build update object
  const updateFields = {};
  if (name) updateFields.name = name;
  if (contactNumber) updateFields.contactNumber = contactNumber;
  if (bankDetails) updateFields.bankDetails = bankDetails;
  if (location) updateFields.location = location;

  try {
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get hosts within radius
// @route   GET /api/users/hosts/nearby
// @access  Private
exports.getNearbyHosts = async (req, res) => {
  const { longitude, latitude, radius = 3 } = req.query;
  
  // Convert radius from km to meters
  const radiusInMeters = radius * 1000;
  
  try {
    const hosts = await User.find({
      userType: 'host',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radiusInMeters
        }
      }
    }).select('-password -bankDetails');

    res.json(hosts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}; 