const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const menuRoutes = require('./routes/menuRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Auto-clean URL (trims whitespace/newlines)
app.use((req, res, next) => {
  req.url = decodeURIComponent(req.url).trim();
  next();
});

// Routes
app.use('/menu', menuRoutes);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Restaurant Menu API is running' });
});

// Database Connection
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant-db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected to restaurant-db');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
