require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const userProductsRoutes = require('./routes/userProductsRoutes');
const notificationsRoutes = require('./routes/notificationsRoutes');
const stepsRoutes = require('./routes/stepsRoutes');
const { initializeData } = require('./data/initialData');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:19006', 'exp://192.168.1.*:19000'],
  credentials: true
}));
app.use(express.json());

// Połączenie z MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitnessApp')
  .then(() => {
    console.log('Polaczono z MongoDB');
    initializeData();
  })
  .catch(err => console.error('Error laczenia z MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-products', userProductsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/steps', stepsRoutes);

// Wyswietlanie Error'ow
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Wewnętrzny błąd serwera',
    error: err.message
  });
});

module.exports = app;