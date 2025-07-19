const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoute = require('./routes/auth');
const moviesRoute = require('./routes/movies');
const usersRoute = require('./routes/users');

// Configuration
dotenv.config();

const app = express();

app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet());

// Allowed origins for CORS
const allowedOrigins = ['http://localhost:3000'];
const frontendURLs = process.env.FRONTEND_URLS || "";
const urls = frontendURLs.split(',').map(url => url.trim());
allowedOrigins.push(...urls);

// Function to allow all Vercel preview URLs
const isVercel = (origin) => {
  return origin && origin.endsWith('.vercel.app');
};

// CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || isVercel(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS. Origin: ${origin}. Allowed: ${allowedOrigins.join(',')}`));
      }
    },
    credentials: true, // Allow credentials (cookies)
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10kb' })); // Limit request body size

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.error('Unable to connect to MongoDB Atlas!', error);
  });

// Routes
app.use('/api/auth', authRoute); // Handles /api/auth/register and /api/auth/login
app.use('/api/movies', moviesRoute); // Handles movie-related routes (e.g., search)
app.use('/api/users', usersRoute); // Handles user-related routes (favorites, watchlists, profile)

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;