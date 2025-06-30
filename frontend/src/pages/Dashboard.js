import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";

const Dashboard = () => {
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's favorite and watchlist movies on component mount
  useEffect(() => {
    const fetchUserMovies = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to be logged in to view your movies.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(response.data.favorites || []);
        setWatchlist(response.data.watchlists || []);
      } catch (error) {
        console.error("Failed to fetch user movies:", error);
        alert("Failed to fetch your movies. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserMovies();
  }, []);

  // Remove or add a movie to favorites
  const handleFavorite = async (movie) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to perform this action.");
      return;
    }

    try {
      if (favorites.some((fav) => fav.movieId === movie.movieId)) {
        // Remove from favorites
        await axios.delete(`http://localhost:5000/api/users/favorites/${movie.movieId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(favorites.filter((fav) => fav.movieId !== movie.movieId));
      } else {
        // Add to favorites
        await axios.post(
          "http://localhost:5000/api/users/favorites",
          {
            movieId: movie.movieId,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.releaseDate,
            vote_average: movie.rating,
            genre_ids: movie.genreIds,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites([...favorites, movie]);
      }
    } catch (error) {
      console.error("Failed to update favorites:", error);
      alert("Failed to update your favorites. Please try again.");
    }
  };

  // Remove or add a movie to watchlist
  const handleWatchlist = async (movie) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to perform this action.");
      return;
    }

    try {
      if (watchlist.some((wl) => wl.movieId === movie.movieId)) {
        // Remove from watchlist
        await axios.delete(`http://localhost:5000/api/users/watchlists/${movie.movieId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist(watchlist.filter((wl) => wl.movieId !== movie.movieId));
      } else {
        // Add to watchlist
        await axios.post(
          "http://localhost:5000/api/users/watchlists",
          {
            movieId: movie.movieId,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.releaseDate,
            vote_average: movie.rating,
            genre_ids: movie.genreIds,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWatchlist([...watchlist, movie]);
      }
    } catch (error) {
      console.error("Failed to update watchlist:", error);
      alert("Failed to update your watchlist. Please try again.");
    }
  };

  // Display a loading screen while data is fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h2>My Favorites</h2>
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
      <h2>My Watchlist</h2>
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
  );
};

export default Dashboard;