const express = require('express');
const router = express.Router();
const { 
  createMeal, 
  getHostMeals, 
  getHostMealsDirect, 
  getNearbyMeals, 
  getMealById, 
  updateMeal, 
  deleteMeal,
  getActiveMeals 
} = require('../controllers/mealController');
const { auth, hostOnly } = require('../middleware/auth');

// @route   POST /api/meals
// @desc    Create a new meal
// @access  Private/Host
router.post('/', auth, hostOnly, createMeal);

// @route   GET /api/meals/host
// @desc    Get all meals by host
// @access  Private/Host
router.get('/host', auth, hostOnly, getHostMeals);

// @route   GET /api/meals/host/direct
// @desc    Direct endpoint to get host meals (alternative endpoint)
// @access  Private/Host
router.get('/host/direct', auth, hostOnly, getHostMealsDirect);

// @route   GET /api/meals/nearby
// @desc    Get all nearby meals
// @access  Private
router.get('/nearby', auth, getNearbyMeals);

// @route   GET /api/meals/active
// @desc    Get all active meals (time-limited visibility)
// @access  Public - anyone can see active meals
router.get('/active', getActiveMeals);

// @route   GET /api/meals/:id
// @desc    Get meal by ID
// @access  Private
router.get('/:id', auth, getMealById);

// @route   PUT /api/meals/:id
// @desc    Update meal
// @access  Private/Host
router.put('/:id', auth, hostOnly, updateMeal);

// @route   DELETE /api/meals/:id
// @desc    Delete meal
// @access  Private/Host
router.delete('/:id', auth, hostOnly, deleteMeal);

module.exports = router; 