require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const userProductsRoutes = require('./routes/userProductsRoutes');
const notificationsRoutes = require('./routes/notificationsRoutes');
const stepsRoutes = require('./routes/stepsRoutes');
const { initializeData } = require('./data/initialData');

const app = express();

// Middleware
app.use(helmet()); // zabezpieczanie nagłówków HTTP
app.use(morgan('dev')); // logger
app.use(cors({
  origin: ['http://localhost:19006', 'exp://192.168.1.*:19000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 100 // Limit każdego IP do 100 żądań na okno czasowe
});
app.use(limiter);

// Połączenie z MongoDB
mongoose.connect(process.env.MONGODB_URI)
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
app.use('/uploads', express.static('public/uploads'));

app.get('/api/status', (req, res) => {
  res.json({
    status: 'Serwer działa',
    dbStatus: mongoose.connection.readyState === 1 ? 'Połączono' : 'Brak połączenia',
    environment: process.env.NODE_ENV
  });
});

// Obsługa błędów 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Nie znaleziono endpointu'
  });
});

// Globalna obsługa błędów
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Wewnętrzny błąd serwera',
    error: err.message
  });
});

module.exports = app;