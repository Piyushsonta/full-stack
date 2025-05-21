const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mealController = require('../controllers/mealController');

// Host routes
router.post('/host', auth, mealController.hostMeal);
router.get('/host/:hostId', auth, mealController.getHostMeals);
router.put('/:mealId/status', auth, mealController.updateMealStatus);
router.delete('/:mealId', auth, mealController.deleteMeal);

// Browse routes
router.get('/active', mealController.getActiveMeals);
router.get('/nearby', mealController.getNearbyMeals);
router.get('/:id', auth, mealController.getMealById);

module.exports = router; 