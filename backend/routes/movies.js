const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Search movies
router.get('/search', async (req, res) => {
  const { query, genre, year } = req.query;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&year=${year}&with_genres=${genre}`;
  const response = await axios.get(url);
  res.json(response.data.results);
});

module.exports = router;