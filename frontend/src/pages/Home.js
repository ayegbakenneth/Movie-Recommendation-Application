import React, { useContext } from 'react';
import { MovieContext } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import '../styles/Banner.css';
import '../styles/Movie.css';

const Home = () => {
  const {
    movies,
    loading,
    handleFavorite,
    handleWatchlist,
    favoriteSet,
    watchlistSet,
  } = useContext(MovieContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-content">
      <div className="home-page">
        <h2 id="pageHeader">Popular Movies</h2>
        <div className="movie-list">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onFavorite={handleFavorite}
              onWatchlist={handleWatchlist}
              isFavorite={favoriteSet.has(String(movie.id))}
              isWatchlist={watchlistSet.has(String(movie.id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 