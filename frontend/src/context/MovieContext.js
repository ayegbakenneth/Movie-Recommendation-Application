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
        `https://api.themoviedb.org/3/movie/popular?api_key=`
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

    try {
      if (favorites.some((fav) => String(fav.movieId) === String(movie.id))) {
        await axios.delete(`http://localhost:5000/api/users/favorites/${movie.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(favorites.filter((fav) => String(fav.movieId) !== String(movie.id)));
      } else {
        await axios.post(
          'http://localhost:5000/api/users/favorites',
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
        // To get the full movie object with MongoDB _id, we should refetch user movies
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

    try {
      if (watchlist.some((wl) => String(wl.movieId) === String(movie.id))) {
        await axios.delete(`http://localhost:5000/api/users/watchlists/${movie.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist(watchlist.filter((wl) => String(wl.movieId) !== String(movie.id)));
      } else {
        await axios.post(
          'http://localhost:5000/api/users/watchlists',
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
        // To get the full movie object with MongoDB _id, we should refetch user movies
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