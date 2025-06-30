// models/Movie.js
const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  movieId: { type: String, required: true, unique: true }, // TMDB movie ID
  title: { type: String, required: true },
  poster_path: { type: String }, // Poster URL from TMDB
  releaseDate: { type: String },
  rating: { type: Number }, // TMDB rating
  genreIds: [{ type: Number }] // Genre IDs from TMDB
});

module.exports = mongoose.model('Movie', MovieSchema);