import React from "react";

const MovieCard = ({ movie, onFavorite, onWatchlist, isFavorite, isWatchlist }) => {
  // Handle different property names for poster path
  const posterPath = movie.poster_path || movie.posterPath;
  const releaseDate = movie.release_date || movie.releaseDate;
  const rating = movie.vote_average || movie.rating;

  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${posterPath}`}
        alt={movie.title}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>Release Date: {releaseDate || "N/A"}</p>
        <p>Rating: {rating || "N/A"}/10</p>
      </div>
      <div className="movie-actions">
        <button onClick={() => onFavorite(movie)}>
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </button>
        <button onClick={() => onWatchlist(movie)}>
          {isWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;