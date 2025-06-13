const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Search Movies
router.get('/search', async (req, res) => {
    const { query } = req.query;

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                query
            }
        });

        res.status(200).json(response.data.results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

module.exports = router;