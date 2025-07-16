import React, { createContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  const favoriteSet = useMemo(() => new Set(favorites.map((fav) => String(fav.movieId))), [favorites]);
  const watchlistSet = useMemo(() => new Set(watchlist.map((wl) => String(wl.movieId))), [watchlist]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/users/me');
        if (response.data) {
          setIsLoggedIn(true);
          setFavorites(response.data.favorites || []);
          setWatchlist(response.data.watchlists || []);
        }
      } catch (error) {
        setIsLoggedIn(false);
        console.log('User not authenticated');
      }
    };
    checkAuth();
    fetchPopularMovies();
  }, []);

  const fetchPopularMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
      );
      setMovies(response.data.results);
    } catch (error) {
      console.error('Failed to fetch popular movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (query) => {
    setNoResults(false);
    if (!query) {
      setMovies([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${query}`
      );
      setMovies(response.data.results);
      if (response.data.results.length === 0) {
        setNoResults(true);
      }
    } catch (error) {
      console.error('Failed to search movies:', error);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMovies = async () => {
    try {
      const response = await api.get('/users/me');
      setFavorites(response.data.favorites || []);
      setWatchlist(response.data.watchlists || []);
    } catch (error) {
      console.error('Failed to fetch user movies:', error);
    }
  };

  const handleMovieListAction = async (movie, listType) => {
    if (!isLoggedIn) {
      alert(`You must be logged in to manage your ${listType}.`);
      return;
    }

    const movieId = movie.id || movie.movieId;
    const list = listType === 'favorites' ? favorites : watchlist;
    const setList = listType === 'favorites' ? setFavorites : setWatchlist;
    const listSet = listType === 'favorites' ? favoriteSet : watchlistSet;
    const endpoint = `/users/${listType}`;

    const movieInList = listSet.has(String(movieId));

    // Optimistic update
    if (movieInList) {
      setList(list.filter((item) => String(item.movieId) !== String(movieId)));
    } else {
      setList([...list, { ...movie, movieId: String(movieId) }]);
    }

    try {
      if (movieInList) {
        await api.delete(`${endpoint}/${movieId}`);
      } else {
        await api.post(
          endpoint,
          {
            movieId: movieId,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            genre_ids: movie.genre_ids,
          }
        );
      }
      // Refetch to ensure data consistency after the API call
      fetchUserMovies();
    } catch (error) {
      console.error(`Failed to update ${listType}:`, error);
      // Revert UI on error
      if (movieInList) {
        setList(list);
      } else {
        setList(list.filter((item) => String(item.movieId) !== String(movieId)));
      }
      alert(`Failed to update ${listType}. Please try again.`);
    }
  };

  const handleFavorite = (movie) => handleMovieListAction(movie, 'favorites');
  const handleWatchlist = (movie) => handleMovieListAction(movie, 'watchlists');

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.user) {
      setIsLoggedIn(true);
      await fetchUserMovies();
    }
    return response;
  };

  const logout = async () => {
    await api.post('/auth/logout', {});
    setIsLoggedIn(false);
    setFavorites([]);
    setWatchlist([]);
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
        favoriteSet,
        watchlistSet,
        login,
        logout,
        searchMovies,
        noResults,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};