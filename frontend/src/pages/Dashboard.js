import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";

const Dashboard = () => {
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchUserMovies = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(response.data.favorites);
      setWatchlist(response.data.watchlists);
    };
    fetchUserMovies();
  }, []);

  return (
    <div className="dashboard">
      <h2>My Favorites</h2>
      <div className="movie-list">
        {favorites.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
      <h2>My Watchlist</h2>
      <div className="movie-list">
        {watchlist.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;