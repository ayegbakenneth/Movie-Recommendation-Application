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

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:3000', // Allow only the frontend to access the API
    credentials: true, // Allow cookies to be sent
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
const db = mongoose.connect(process.env.MONGO_URI)
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