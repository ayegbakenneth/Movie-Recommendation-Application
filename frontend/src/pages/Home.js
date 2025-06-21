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

  // Check if the user is logged in (based on token in localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Convert token to boolean
  }, []);

  // Fetch popular movies from TMDB API
  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=`
      );
      setMovies(response.data.results);
    };
    fetchMovies();
  }, []);

  // Add or remove a movie from favorites
  const handleFavorite = async (movie) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You need to be logged in to perform this action.");
    return;
  }

  try {
    // Check if the movie is already in favorites
    if (favorites.some((fav) => fav.movieId === movie.id)) {
      // Remove from favorites
      await axios.delete(`http://localhost:5000/api/users/favorites/${movie.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(favorites.filter((fav) => fav.movieId !== movie.id));
      alert("Movie removed from favorites.");
    } else {
      // Add to favorites
      const response = await axios.post(
        "http://localhost:5000/api/users/favorites",
        {
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          releaseDate: movie.release_date,
          rating: movie.vote_average,
          genreIds: movie.genre_ids,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFavorites([...favorites, response.data.movie]);
      alert("Movie added to favorites.");
    }
  } catch (error) {
    console.error("Failed to update favorites:", error);
    alert("Failed to update favorites. Please try again.");
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

      if (watchlist.some((wl) => wl.id === movie.id)) {
        // Remove from watchlist
        await axios.delete(`http://localhost:5000/api/users/watchlists/${movie.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist(watchlist.filter((wl) => wl.id !== movie.id));
      } else {
        // Add to watchlist
        await axios.post(
          "http://localhost:5000/api/users/watchlists",
          { movieId: movie.id, title: movie.title, poster_path: movie.poster_path },
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
            isFavorite={favorites.some((fav) => fav.id === movie.id)}
            isWatchlist={watchlist.some((wl) => wl.id === movie.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;