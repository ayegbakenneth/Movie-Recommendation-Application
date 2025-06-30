import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import '../styles/Banner.css';
import '../styles/Movie.css'

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Fetch user's movies if logged in
      const fetchUserMovies = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFavorites(response.data.favorites || []);
          setWatchlist(response.data.watchlists || []);
        } catch (error) {
          console.error("Failed to fetch user movies:", error);
        }
      };
      fetchUserMovies();
    }
  }, []);

  // Fetch popular movies from TMDB API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=`
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error("Failed to fetch popular movies:", error);
      }
    };
    fetchMovies();
  }, []);

  // Add or remove a movie from favorites
  const handleFavorite = async (movie) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to add movies to favorites.");
        return;
      }

      if (favorites.some((fav) => String(fav.movieId) === String(movie.id))) {
        // Remove from favorites
        await axios.delete(`http://localhost:5000/api/users/favorites/${movie.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(favorites.filter((fav) => String(fav.movieId) !== String(movie.id)));
      } else {
        // Add to favorites
        await axios.post(
          "http://localhost:5000/api/users/favorites",
          {
            movieId: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            genre_ids: movie.genre_ids,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites([...favorites, movie]);
      }
    } catch (error) {
      console.error("Failed to update favorites:", error);
    }
  };

  // Add or remove a movie from watchlist
  const handleWatchlist = async (movie) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to add movies to watchlist.");
        return;
      }

      if (watchlist.some((wl) => String(wl.movieId) === String(movie.id))) {
        // Remove from watchlist
        await axios.delete(`http://localhost:5000/api/users/watchlists/${movie.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist(watchlist.filter((wl) => String(wl.movieId) !== String(movie.id)));
      } else {
        // Add to watchlist
        await axios.post(
          "http://localhost:5000/api/users/watchlists",
          {
            movieId: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            genre_ids: movie.genre_ids,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWatchlist([...watchlist, movie]);
      }
    } catch (error) {
      console.error("Failed to update watchlist:", error);
    }
  };

  return (
    <div className="home-page">
      <h2 id="pageHeader">Popular Movies</h2>
      <div className="movie-list">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onFavorite={handleFavorite}
            onWatchlist={handleWatchlist}
            isFavorite={favorites.some((fav) => String(fav.movieId) === String(movie.id))}
            isWatchlist={watchlist.some((wl) => String(wl.movieId) === String(movie.id))}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;