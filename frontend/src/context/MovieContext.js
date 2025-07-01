import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserMovies(token);
    }
    fetchPopularMovies();
  }, []);

  const fetchPopularMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=70302ba9f2708548fa805fb8dd10fa95`
      );
      setMovies(response.data.results);
    } catch (error) {
      console.error('Failed to fetch popular movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMovies = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(response.data.favorites || []);
      setWatchlist(response.data.watchlists || []);
    } catch (error) {
      console.error('Failed to fetch user movies:', error);
    }
  };

  const handleFavorite = async (movie) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to add movies to favorites.');
      return;
    }

    const movieId = movie.id || movie.movieId;

    try {
      if (favorites.some((fav) => String(fav.movieId) === String(movieId))) {
        await axios.delete(`http://localhost:5000/api/users/favorites/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(favorites.filter((fav) => String(fav.movieId) !== String(movieId)));
      } else {
        await axios.post(
          'http://localhost:5000/api/users/favorites',
          {
            movieId: movieId,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            genre_ids: movie.genre_ids,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchUserMovies(token);
      }
    } catch (error) {
      console.error('Failed to update favorites:', error);
    }
  };

  const handleWatchlist = async (movie) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to add movies to watchlist.');
      return;
    }

    const movieId = movie.id || movie.movieId;

    try {
      if (watchlist.some((wl) => String(wl.movieId) === String(movieId))) {
        await axios.delete(`http://localhost:5000/api/users/watchlists/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist(watchlist.filter((wl) => String(wl.movieId) !== String(movieId)));
      } else {
        await axios.post(
          'http://localhost:5000/api/users/watchlists',
          {
            movieId: movieId,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            genre_ids: movie.genre_ids,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchUserMovies(token);
      }
    } catch (error) {
      console.error('Failed to update watchlist:', error);
    }
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        favorites,
        watchlist,
        isLoggedIn,
        loading,
        handleFavorite,
        handleWatchlist,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};