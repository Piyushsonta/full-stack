const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());

// Increase payload size limit to handle larger image uploads
app.use(express.json({ limit: '50mb', parameterLimit: 100000 }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 100000 }));

// MongoDB Connection with detailed error logging
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/homemeal')
  .then(() => {
    console.log('MongoDB connected successfully');
    console.log('Database URL:', process.env.MONGO_URI);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Connection string used:', process.env.MONGO_URI);
    console.error('Full error details:', JSON.stringify(err, null, 2));
  });

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/meals', require('./routes/meals'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/notifications', require('./routes/notifications'));

// Default route
app.get('/', (req, res) => {
  res.send('HomeMeal API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
console.log(`Using port: ${PORT} from env: ${process.env.PORT}`);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Add this near the top of your main index.js or in a separate config file
axios.defaults.baseURL = 'http://localhost:5001'; 