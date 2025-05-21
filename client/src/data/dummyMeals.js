// Dummy meal data for guest users
const dummyMeals = [
  {
    _id: 'dummy1',
    title: 'Homemade Italian Pasta',
    description: "Authentic Italian pasta made from scratch with fresh ingredients. Enjoy a traditional Italian dining experience with homemade sauce and freshly grated Parmesan cheese. Savor every bite of this classic comfort dish, perfect for pasta lovers.",
    price: 25.99,
    servingTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    location: {
      coordinates: [-73.9857, 40.7484], // NYC coordinates
      address: 'Manhattan, New York'
    },
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cuisine: 'Italian',
    accommodation: true,
    hostId: 'dummy-host-1',
    hostName: 'Maria Rossi',
    host: { name: 'Maria Rossi', contactNumber: '+1 555-123-4567' },
    isVegetarian: false,
    dietaryOptions: ['Gluten-free option available'],
    ingredients: ['Flour', 'Eggs', 'Olive oil', 'Tomatoes', 'Garlic', 'Basil', 'Parmesan cheese']
  },
  {
    _id: 'dummy2',
    title: 'Traditional Indian Thali',
    description: "Experience the flavors of India with this complete thali meal featuring a variety of dishes including curry, rice, bread, and dessert. Each bite brings a burst of spices and aromas, transporting you to the heart of India. A truly satisfying and wholesome dining experience.",
    price: 18.50,
    servingTime: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    location: {
      coordinates: [-74.0060, 40.7128], // Different NYC coordinates
      address: 'Brooklyn, New York'
    },
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cuisine: 'Indian',
    accommodation: false,
    hostId: 'dummy-host-2',
    hostName: 'Priya Patel',
    host: { name: 'Priya Patel', contactNumber: '+1 555-234-5678' },
    isVegetarian: true,
    dietaryOptions: ['Vegan option available', 'Nut-free'],
    ingredients: ['Rice', 'Lentils', 'Vegetables', 'Spices', 'Yogurt', 'Wheat flour', 'Ghee']
  },
  {
    _id: 'dummy3',
    title: 'Mexican Street Food Fiesta',
    description: "Enjoy authentic Mexican street food including tacos, quesadillas, and churros for dessert. Each dish bursts with bold spices and fresh ingredients. This fiesta is a celebration of color, flavor, and culinary tradition.",
    price: 22.00,
    servingTime: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    location: {
      coordinates: [-73.9442, 40.6782], // Another NYC location
      address: 'Queens, New York'
    },
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cuisine: 'Mexican',
    accommodation: true,
    hostId: 'dummy-host-3',
    hostName: 'Carlos Rodriguez',
    host: { name: 'Carlos Rodriguez', contactNumber: '+1 555-345-6789' },
    isVegetarian: false,
    dietaryOptions: ['Vegetarian option available'],
    ingredients: ['Corn tortillas', 'Beef', 'Chicken', 'Cheese', 'Beans', 'Avocado', 'Tomatoes', 'Cilantro']
  },
  {
    _id: 'dummy4',
    title: 'Japanese Sushi Experience',
    description: "Learn how to make sushi rolls and enjoy a variety of fresh sushi prepared right in front of you. Experience the artistry of Japanese cuisine with miso soup and green tea. Perfect for sushi enthusiasts and curious foodies alike.",
    price: 35.00,
    servingTime: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
    location: {
      coordinates: [-73.9654, 40.8116], // Upper Manhattan
      address: 'Upper Manhattan, New York'
    },
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cuisine: 'Japanese',
    accommodation: false,
    hostId: 'dummy-host-4',
    hostName: 'Kenji Tanaka',
    host: { name: 'Kenji Tanaka', contactNumber: '+1 555-456-7890' },
    isVegetarian: false,
    dietaryOptions: ['Vegetarian option available', 'Gluten-free option available'],
    ingredients: ['Sushi rice', 'Nori', 'Fresh fish', 'Cucumber', 'Avocado', 'Soy sauce', 'Wasabi', 'Ginger']
  },
  {
    _id: 'dummy5',
    title: 'Mediterranean Mezze Platter',
    description: "A selection of Mediterranean appetizers including hummus, baba ganoush, falafel, and fresh pita bread. Perfect for sharing with friends or family. Enjoy a vibrant platter full of fresh flavors and healthy ingredients.",
    price: 28.75,
    servingTime: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
    location: {
      coordinates: [-74.0445, 40.6892], // Jersey City
      address: 'Jersey City, New Jersey'
    },
    image: 'https://images.unsplash.com/photo-1542345812-d98b5cd6cf98?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cuisine: 'Mediterranean',
    accommodation: true,
    hostId: 'dummy-host-5',
    hostName: 'Elena Stavros',
    host: { name: 'Elena Stavros', contactNumber: '+1 555-567-8901' },
    isVegetarian: true,
    dietaryOptions: ['Vegan', 'Gluten-free option available'],
    ingredients: ['Chickpeas', 'Tahini', 'Eggplant', 'Olive oil', 'Garlic', 'Lemon', 'Pita bread', 'Herbs']
  },
  {
    _id: 'dummy6',
    title: 'Southern Comfort Food',
    description: "Classic Southern cooking featuring fried chicken, mac and cheese, collard greens, and homemade cornbread. Just like grandma used to make! Indulge in the warmth and comfort of a true southern feast.",
    price: 24.50,
    servingTime: new Date(Date.now() + 518400000).toISOString(), // 6 days from now
    location: {
      coordinates: [-73.9712, 40.7831], // Upper East Side
      address: 'Upper East Side, New York'
    },
    image: 'https://images.unsplash.com/photo-1549590143-d5855148a9d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cuisine: 'American',
    accommodation: false,
    hostId: 'dummy-host-6',
    hostName: 'Sarah Johnson',
    host: { name: 'Sarah Johnson', contactNumber: '+1 555-678-9012' },
    isVegetarian: false,
    dietaryOptions: [],
    ingredients: ['Chicken', 'Flour', 'Butter', 'Cheese', 'Milk', 'Cornmeal', 'Greens', 'Spices']
  },
  {
    _id: 'dummy7',
    title: 'Thai Green Curry Feast',
    description: "Authentic Thai green curry with aromatic herbs, coconut milk, and your choice of protein. Served with jasmine rice and crispy spring rolls. A fragrant, spicy, and unforgettable Thai experience.",
    price: 21.99,
    servingTime: new Date(Date.now() + 604800000).toISOString(), // 7 days from now
    location: {
      coordinates: [-73.9865, 40.7128], // Downtown NYC
      address: 'Downtown, New York'
    },
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cuisine: 'Thai',
    accommodation: true,
    hostId: 'dummy-host-7',
    hostName: 'Suki Thaiwan',
    host: { name: 'Suki Thaiwan', contactNumber: '+1 555-789-0123' },
    isVegetarian: false,
    dietaryOptions: ['Vegetarian option available', 'Gluten-free'],
    ingredients: ['Coconut milk', 'Green curry paste', 'Thai basil', 'Bamboo shoots', 'Chicken', 'Jasmine rice', 'Lemongrass', 'Kaffir lime leaves']
  },
  {
    _id: 'dummy8',
    title: 'Spanish Paella Party',
    description: "Traditional Spanish paella cooked in a large pan with saffron rice, seafood, chicken, and chorizo. Gather around for a social dining experience and savor the rich, hearty flavors of Spain.",
    price: 32.50,
    servingTime: new Date(Date.now() + 691200000).toISOString(), // 8 days from now
    location: {
      coordinates: [-73.9632, 40.7794], // Upper West Side
      address: 'Upper West Side, New York'
    },
    image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cuisine: 'Spanish',
    accommodation: true,
    hostId: 'dummy-host-8',
    hostName: 'Miguel Fernandez',
    host: { name: 'Miguel Fernandez', contactNumber: '+1 555-890-1234' },
    isVegetarian: false,
    dietaryOptions: ['Seafood-free option available'],
    ingredients: ['Arborio rice', 'Saffron', 'Chicken', 'Shrimp', 'Mussels', 'Chorizo', 'Bell peppers', 'Peas']
  },
  {
    _id: 'dummy9',
    title: 'Vegan Buddha Bowl',
    description: "Nutritious and colorful vegan buddha bowl with quinoa, roasted vegetables, avocado, and tahini dressing. Packed with nutrients and flavor, this bowl is a deliciously healthy choice for any meal.",
    price: 19.95,
    servingTime: new Date(Date.now() + 777600000).toISOString(), // 9 days from now
    location: {
      coordinates: [-73.9278, 40.8075], // Bronx
      address: 'Bronx, New York'
    },
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cuisine: 'Vegan',
    accommodation: false,
    hostId: 'dummy-host-9',
    hostName: 'Luna Green',
    host: { name: 'Luna Green', contactNumber: '+1 555-901-2345' },
    isVegetarian: true,
    dietaryOptions: ['Vegan', 'Gluten-free', 'Nut-free option available'],
    ingredients: ['Quinoa', 'Sweet potatoes', 'Kale', 'Chickpeas', 'Avocado', 'Tahini', 'Lemon juice', 'Sesame seeds']
  },
  {
    _id: 'dummy10',
    title: 'Korean BBQ Experience',
    description: "Interactive Korean BBQ experience where you grill your own marinated meats at the table. Served with banchan (side dishes) and lettuce wraps. Enjoy a fun and flavorful meal with friends.",
    price: 38.00,
    servingTime: new Date(Date.now() + 864000000).toISOString(), // 10 days from now
    location: {
      coordinates: [-74.0123, 40.7033], // Staten Island
      address: 'Staten Island, New York'
    },
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cuisine: 'Korean',
    accommodation: true,
    hostId: 'dummy-host-10',
    hostName: 'Ji-Hoon Park',
    host: { name: 'Ji-Hoon Park', contactNumber: '+1 555-012-3456' },
    isVegetarian: false,
    dietaryOptions: ['Vegetarian option available'],
    ingredients: ['Beef bulgogi', 'Pork belly', 'Kimchi', 'Lettuce', 'Rice', 'Gochujang', 'Sesame oil', 'Garlic']
  },
  {
    _id: 'dummy11',
    title: 'French Pastry Workshop',
    description: "Learn to make authentic French pastries including croissants, pain au chocolat, and macarons. Take home your delicious creations and savor the taste of Paris in every bite.",
    price: 45.00,
    servingTime: new Date(Date.now() + 950400000).toISOString(), // 11 days from now
    location: {
      coordinates: [-73.9845, 40.7485], // Midtown Manhattan
      address: 'Midtown Manhattan, New York'
    },
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cuisine: 'French',
    accommodation: false,
    hostId: 'dummy-host-11',
    hostName: 'Sophie Dubois',
    host: { name: 'Sophie Dubois', contactNumber: '+1 555-123-4568' },
    isVegetarian: true,
    dietaryOptions: ['Dairy-free option available'],
    ingredients: ['Flour', 'Butter', 'Sugar', 'Eggs', 'Chocolate', 'Almond flour', 'Vanilla', 'Cream']
  },
  {
    _id: 'dummy12',
    title: 'Caribbean Jerk Chicken Dinner',
    description: "Spicy jerk chicken marinated in authentic Caribbean spices and grilled to perfection. Served with rice and peas, plantains, and tropical fruit punch. A taste of the islands in every bite!",
    price: 26.75,
    servingTime: new Date(Date.now() + 1036800000).toISOString(), // 12 days from now
    location: {
      coordinates: [-73.9490, 40.8070], // Harlem
      address: 'Harlem, New York'
    },
    image: 'https://images.unsplash.com/photo-1532465614-6cc8d45f647f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    cuisine: 'Caribbean',
    accommodation: true,
    hostId: 'dummy-host-12',
    hostName: 'Andre Williams',
    isVegetarian: false,
    dietaryOptions: ['Vegetarian option available'],
    ingredients: ['Chicken', 'Scotch bonnet peppers', 'Allspice', 'Thyme', 'Rice', 'Kidney beans', 'Plantains', 'Coconut milk']
  }
];

export default dummyMeals;
