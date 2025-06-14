const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Movie = require('../models/Movie');
const router = express.Router();

// Middleware to authenticate user using JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get logged-in user's details
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favorites watchlists');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Add a movie to favorites
router.post('/favorites', authenticate, async (req, res) => {
  try {
    const { movieId, title, posterPath, releaseDate, rating, genreIds } = req.body;

    // Check if the movie already exists in the database
    let movie = await Movie.findOne({ movieId });
    if (!movie) {
      movie = new Movie({ movieId, title, posterPath, releaseDate, rating, genreIds });
      await movie.save();
    }

    // Add the movie to the user's favorites
    const user = await User.findById(req.userId);
    if (user.favorites.includes(movie._id)) {
      return res.status(400).json({ error: 'Movie already in favorites' });
    }
    user.favorites.push(movie._id);
    await user.save();

    res.status(201).json({ message: 'Movie added to favorites', movie });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add movie to favorites' });
  }
});

// Remove a movie from favorites
router.delete('/favorites/:movieId', authenticate, async (req, res) => {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findOne({ movieId });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const user = await User.findById(req.userId);
    user.favorites = user.favorites.filter(fav => fav.toString() !== movie._id.toString());
    await user.save();

    res.json({ message: 'Movie removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove movie from favorites' });
  }
});

// Add a movie to watchlist
router.post('/watchlists', authenticate, async (req, res) => {
  try {
    const { movieId, title, posterPath, releaseDate, rating, genreIds } = req.body;

    // Check if the movie already exists in the database
    let movie = await Movie.findOne({ movieId });
    if (!movie) {
      movie = new Movie({ movieId, title, posterPath, releaseDate, rating, genreIds });
      await movie.save();
    }

    // Add the movie to the user's watchlist
    const user = await User.findById(req.userId);
    if (user.watchlists.includes(movie._id)) {
      return res.status(400).json({ error: 'Movie already in watchlist' });
    }
    user.watchlists.push(movie._id);
    await user.save();

    res.status(201).json({ message: 'Movie added to watchlist', movie });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add movie to watchlist' });
  }
});

// Remove a movie from watchlist
router.delete('/watchlists/:movieId', authenticate, async (req, res) => {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findOne({ movieId });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const user = await User.findById(req.userId);
    user.watchlists = user.watchlists.filter(watch => watch.toString() !== movie._id.toString());
    await user.save();

    res.json({ message: 'Movie removed from watchlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove movie from watchlist' });
  }
});

module.exports = router;