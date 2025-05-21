// Dummy meal data for host users to reference when creating their own meals
const dummyHostMeals = [
  {
    _id: 'host-dummy1',
    title: 'Authentic Homemade Pizza Night',
    description: 'Learn to make pizza from scratch with homemade dough and sauce. Choose your own toppings and enjoy wood-fired style pizza made in a home oven with a pizza stone. Perfect for families and groups!',
    category: 'dinner',
    cuisine: 'italian',
    price: 29.99,
    servingDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    servingTime: '18:00',
    expiryTime: '3', // 3 hours
    maxGuests: 6,
    isVegetarian: false,
    dietaryPreferences: ['vegetarian', 'gluten-free'],
    ingredients: ['Flour', 'Yeast', 'Olive oil', 'Tomatoes', 'Mozzarella', 'Basil', 'Various toppings'],
    allergens: 'Gluten, dairy',
    preparationTime: 90,
    spicyLevel: 'mild',
    withAccommodation: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    location: {
      address: 'Brooklyn Heights, New York',
      coordinates: [-73.9962, 40.6963]
    }
  },
  {
    _id: 'host-dummy2',
    title: 'Vietnamese Pho Workshop',
    description: 'Learn the secrets of making authentic Vietnamese Pho with homemade broth that has been simmering for 12 hours. Customize your bowl with various toppings and learn about Vietnamese culinary traditions.',
    category: 'lunch',
    cuisine: 'other',
    price: 32.50,
    servingDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
    servingTime: '12:30',
    expiryTime: '2', // 2 hours
    maxGuests: 4,
    isVegetarian: false,
    dietaryPreferences: ['gluten-free'],
    ingredients: ['Beef bones', 'Rice noodles', 'Bean sprouts', 'Herbs', 'Lime', 'Hoisin sauce', 'Sriracha'],
    allergens: 'Soy, fish sauce',
    preparationTime: 120,
    spicyLevel: 'medium',
    withAccommodation: false,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    location: {
      address: 'Chinatown, New York',
      coordinates: [-73.9971, 40.7148]
    }
  },
  {
    _id: 'host-dummy3',
    title: 'Mediterranean Mezze Feast',
    description: 'Experience a spread of Mediterranean small plates including homemade hummus, baba ganoush, tabbouleh, and freshly baked pita bread. Learn about Mediterranean spices and cooking techniques.',
    category: 'dinner',
    cuisine: 'other',
    price: 27.00,
    servingDate: new Date(Date.now() + 259200000).toISOString().split('T')[0], // 3 days from now
    servingTime: '19:00',
    expiryTime: '3', // 3 hours
    maxGuests: 8,
    isVegetarian: true,
    dietaryPreferences: ['vegan', 'gluten-free', 'dairy-free'],
    ingredients: ['Chickpeas', 'Tahini', 'Eggplant', 'Bulgur wheat', 'Olive oil', 'Lemon', 'Fresh herbs', 'Spices'],
    allergens: 'Sesame, gluten (in pita)',
    preparationTime: 60,
    spicyLevel: 'mild',
    withAccommodation: true,
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    location: {
      address: 'Astoria, Queens, New York',
      coordinates: [-73.9233, 40.7643]
    }
  },
  {
    _id: 'host-dummy4',
    title: 'Japanese Ramen Master Class',
    description: 'Learn to make authentic Japanese ramen from scratch, including handmade noodles and rich tonkotsu broth. Discover the secrets of perfect chashu pork and marinated eggs.',
    category: 'dinner',
    cuisine: 'japanese',
    price: 40.00,
    servingDate: new Date(Date.now() + 345600000).toISOString().split('T')[0], // 4 days from now
    servingTime: '18:30',
    expiryTime: '2', // 2 hours
    maxGuests: 4,
    isVegetarian: false,
    dietaryPreferences: [],
    ingredients: ['Pork bones', 'Flour', 'Eggs', 'Soy sauce', 'Mirin', 'Green onions', 'Nori', 'Bamboo shoots'],
    allergens: 'Gluten, soy, eggs',
    preparationTime: 180,
    spicyLevel: 'medium',
    withAccommodation: false,
    image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    location: {
      address: 'East Village, New York',
      coordinates: [-73.9844, 40.7292]
    }
  },
  {
    _id: 'host-dummy5',
    title: 'Indian Vegetarian Thali Experience',
    description: 'Enjoy a complete Indian vegetarian thali meal with multiple dishes representing different flavors and cooking techniques. Learn about Indian spices and their health benefits.',
    category: 'dinner',
    cuisine: 'indian',
    price: 35.00,
    servingDate: new Date(Date.now() + 432000000).toISOString().split('T')[0], // 5 days from now
    servingTime: '19:30',
    expiryTime: '2', // 2 hours
    maxGuests: 6,
    isVegetarian: true,
    dietaryPreferences: ['vegetarian', 'vegan', 'gluten-free'],
    ingredients: ['Lentils', 'Rice', 'Vegetables', 'Indian spices', 'Yogurt', 'Chickpea flour', 'Paneer', 'Ghee'],
    allergens: 'Dairy, nuts',
    preparationTime: 120,
    spicyLevel: 'hot',
    withAccommodation: true,
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    location: {
      address: 'Jackson Heights, Queens, New York',
      coordinates: [-73.8835, 40.7500]
    }
  },
  {
    _id: 'host-dummy6',
    title: 'Southern BBQ Masterclass',
    description: 'Learn the art of slow-cooked Southern BBQ with homemade rubs and sauces. Includes smoking techniques, side dishes, and the perfect cornbread recipe.',
    category: 'dinner',
    cuisine: 'american',
    price: 45.00,
    servingDate: new Date(Date.now() + 518400000).toISOString().split('T')[0], // 6 days from now
    servingTime: '17:00',
    expiryTime: '4', // 4 hours
    maxGuests: 8,
    isVegetarian: false,
    dietaryPreferences: [],
    ingredients: ['Pork ribs', 'Brisket', 'Chicken', 'Spices', 'Apple cider vinegar', 'Brown sugar', 'Cornmeal', 'Butter'],
    allergens: 'Gluten (in cornbread), dairy',
    preparationTime: 240,
    spicyLevel: 'medium',
    withAccommodation: true,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    location: {
      address: 'Williamsburg, Brooklyn, New York',
      coordinates: [-73.9567, 40.7145]
    }
  },
  {
    _id: 'host-dummy7',
    title: 'French Pastry Workshop',
    description: 'Master the art of French pastry making with classic techniques for croissants, éclairs, and tarts. Take home your creations and impress your friends and family.',
    category: 'breakfast',
    cuisine: 'other',
    price: 55.00,
    servingDate: new Date(Date.now() + 604800000).toISOString().split('T')[0], // 7 days from now
    servingTime: '10:00',
    expiryTime: '3', // 3 hours
    maxGuests: 6,
    isVegetarian: true,
    dietaryPreferences: [],
    ingredients: ['Butter', 'Flour', 'Eggs', 'Sugar', 'Cream', 'Vanilla beans', 'Chocolate', 'Fruit'],
    allergens: 'Gluten, dairy, eggs, nuts',
    preparationTime: 180,
    spicyLevel: 'mild',
    withAccommodation: false,
    image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    location: {
      address: 'SoHo, New York',
      coordinates: [-74.0018, 40.7248]
    }
  },
  {
    _id: 'host-dummy8',
    title: 'Mexican Street Food Fiesta',
    description: 'Learn to make authentic Mexican street food including tacos al pastor, elotes, and churros. Includes homemade tortillas and traditional cooking methods.',
    category: 'dinner',
    cuisine: 'mexican',
    price: 38.00,
    servingDate: new Date(Date.now() + 691200000).toISOString().split('T')[0], // 8 days from now
    servingTime: '18:00',
    expiryTime: '3', // 3 hours
    maxGuests: 8,
    isVegetarian: false,
    dietaryPreferences: ['vegetarian'],
    ingredients: ['Corn masa', 'Pork', 'Pineapple', 'Corn', 'Chiles', 'Lime', 'Cilantro', 'Chocolate'],
    allergens: 'Dairy, corn',
    preparationTime: 120,
    spicyLevel: 'hot',
    withAccommodation: true,
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    location: {
      address: 'Bushwick, Brooklyn, New York',
      coordinates: [-73.9095, 40.6958]
    }
  }
];

export default dummyHostMeals;
