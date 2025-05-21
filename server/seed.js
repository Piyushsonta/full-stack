const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Meal = require('./models/Meal');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample host user data
const hostUserData = {
  name: 'Chef Maria',
  email: 'chef.maria@example.com',
  password: 'password123',
  age: 35,
  contactNumber: '555-123-4567',
  userType: 'host',
  bankDetails: {
    accountNumber: '1234567890',
    bankName: 'Example Bank'
  },
  location: {
    type: 'Point',
    coordinates: [-73.9654, 40.7829], // Example: NYC Central Park
    address: '123 Park Ave, New York, NY'
  }
};

// Sample meals data
const now = Date.now();
const mealsData = [
  {
    name: 'Homemade Italian Pasta Night',
    description: 'Experience authentic Italian cuisine with homemade pasta and traditional sauces. Menu includes fresh bread, antipasti, handmade pasta with your choice of sauce, and tiramisu for dessert.',
    category: 'dinner',
    cuisine: 'italian',
    dietaryPreferences: ['vegetarian'],
    spicyLevel: 'mild',
    ingredients: ['flour', 'eggs', 'olive oil', 'tomato', 'parmesan', 'basil'],
    servingTime: new Date(now + 7 * 24 * 60 * 60 * 1000),
    expiryTime: new Date(now + 8 * 24 * 60 * 60 * 1000),
    price: 25.99,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=880',
    maxServings: 10,
    preparationTime: 120,
    location: {
      type: 'Point',
      coordinates: [-73.9654, 40.7829],
      address: '123 Park Ave, New York, NY'
    }
  },
  {
    name: 'Southern BBQ Feast',
    description: 'Enjoy slow-cooked BBQ ribs, pulled pork, cornbread, mac & cheese, and homemade coleslaw. Finish with a slice of pecan pie and sweet tea.',
    category: 'dinner',
    cuisine: 'american',
    dietaryPreferences: [],
    spicyLevel: 'medium',
    ingredients: ['pork ribs', 'cornbread', 'macaroni', 'cheese', 'coleslaw'],
    servingTime: new Date(now + 8 * 24 * 60 * 60 * 1000),
    expiryTime: new Date(now + 9 * 24 * 60 * 60 * 1000),
    price: 32.50,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=765',
    maxServings: 15,
    preparationTime: 180,
    location: {
      type: 'Point',
      coordinates: [-73.9654, 40.7829],
      address: '123 Park Ave, New York, NY'
    }
  },
  {
    name: 'Authentic Thai Dinner Experience',
    description: 'Savor the flavors of Thailand with this authentic meal featuring Tom Yum soup, Pad Thai, Green Curry, and Mango Sticky Rice for dessert.',
    category: 'dinner',
    cuisine: 'thai',
    dietaryPreferences: ['gluten-free'],
    spicyLevel: 'hot',
    ingredients: ['shrimp', 'rice noodles', 'lemongrass', 'coconut milk', 'green curry paste'],
    servingTime: new Date(now + 6 * 24 * 60 * 60 * 1000),
    expiryTime: new Date(now + 7 * 24 * 60 * 60 * 1000),
    price: 28.99,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=870',
    maxServings: 12,
    preparationTime: 90,
    location: {
      type: 'Point',
      coordinates: [-73.9654, 40.7829],
      address: '123 Park Ave, New York, NY'
    }
  },
  {
    name: 'Mediterranean Feast',
    description: 'A delightful selection of Mediterranean dishes including hummus, falafel, tabbouleh, grilled vegetables, and baklava for dessert.',
    category: 'dinner',
    cuisine: 'other',
    dietaryPreferences: ['vegan'],
    spicyLevel: 'mild',
    ingredients: ['chickpeas', 'tahini', 'parsley', 'olive oil', 'eggplant'],
    servingTime: new Date(now + 9 * 24 * 60 * 60 * 1000),
    expiryTime: new Date(now + 10 * 24 * 60 * 60 * 1000),
    price: 26.50,
    image: 'https://images.unsplash.com/photo-1544941891-439121ca4986?q=80&w=870',
    maxServings: 20,
    preparationTime: 100,
    location: {
      type: 'Point',
      coordinates: [-73.9654, 40.7829],
      address: '123 Park Ave, New York, NY'
    }
  },
  {
    name: 'Japanese Sushi Night',
    description: 'Experience the art of sushi making with a selection of fresh maki rolls, nigiri, sashimi, miso soup, and green tea ice cream.',
    category: 'dinner',
    cuisine: 'japanese',
    dietaryPreferences: [],
    spicyLevel: 'medium',
    ingredients: ['rice', 'nori', 'salmon', 'tuna', 'avocado'],
    servingTime: new Date(now + 10 * 24 * 60 * 60 * 1000),
    expiryTime: new Date(now + 11 * 24 * 60 * 60 * 1000),
    price: 38.99,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=870',
    maxServings: 8,
    preparationTime: 150,
    location: {
      type: 'Point',
      coordinates: [-73.9654, 40.7829],
      address: '123 Park Ave, New York, NY'
    }
  }
];

// Seed function to populate database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Meal.deleteMany({});
    
    console.log('Existing data cleared');
    
    // Save the host user (password will be hashed by pre-save hook)
    const hostUser = new User(hostUserData);
    await hostUser.save();
    console.log('Host user created');
    
    // Create meals with the host user
    const mealPromises = mealsData.map(meal => {
      const newMeal = new Meal({
        ...meal,
        host: hostUser._id
      });
      return newMeal.save();
    });
    
    await Promise.all(mealPromises);
    
    console.log('Meals created successfully');
    console.log('Database seeding complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 