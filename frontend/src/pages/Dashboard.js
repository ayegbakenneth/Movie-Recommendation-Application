import React, { useContext } from 'react';
import { MovieContext } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { favorites, watchlist, loading, handleFavorite, handleWatchlist } = useContext(MovieContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">My Dashboard</h1>
      <div className="movie-section">
        <h2 className="section-title">My Favorites</h2>
        <div className="movie-list">
          {favorites.length > 0 ? (
            favorites.map((movie) => (
              <MovieCard
                key={movie.movieId}
                movie={movie}
                onFavorite={handleFavorite}
                onWatchlist={handleWatchlist}
                isFavorite={true}
                isWatchlist={watchlist.some((wl) => wl.movieId === movie.movieId)}
              />
            ))
          ) : (
            <p>No movies in your favorites yet.</p>
          )}
        </div>
      </div>
      <div className="movie-section">
        <h2 className="section-title">My Watchlist</h2>
        <div className="movie-list">
          {watchlist.length > 0 ? (
            watchlist.map((movie) => (
              <MovieCard
                key={movie.movieId}
                movie={movie}
                onFavorite={handleFavorite}
                onWatchlist={handleWatchlist}
                isFavorite={favorites.some((fav) => fav.movieId === movie.movieId)}
                isWatchlist={true}
              />
            ))
          ) : (
            <p>No movies in your watchlist yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;