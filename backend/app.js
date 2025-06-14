const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const moviesRoute = require('./routes/movies');
const usersRoute = require('./routes/users');

// Initialize dotenv for environment variables
dotenv.config();

const app = express();

// Middleware to handle CORS
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

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