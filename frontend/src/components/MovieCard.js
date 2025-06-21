import React from "react";

const MovieCard = ({ movie, onFavorite, onWatchlist, isFavorite, isWatchlist }) => {
  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="movie-poster"
      />
      <h3>{movie.title}</h3>
      <p>Release Date: {movie.release_date || "N/A"}</p>
      <p>Rating: {movie.vote_average || "N/A"}/10</p>
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