import React, { useContext } from 'react';
import { MovieContext } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
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
    noResults,
  } = useContext(MovieContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-content">
      <div className="home-page">
        <div className="home-header">
          <h2 id="pageHeader">Popular Movies</h2>
          <SearchBar />
        </div>
        <div className="movie-list">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onFavorite={handleFavorite}
                onWatchlist={handleWatchlist}
                isFavorite={favoriteSet.has(String(movie.id))}
                isWatchlist={watchlistSet.has(String(movie.id))}
              />
            ))
          ) : (
            <div>{noResults ? 'No results found for your search.' : 'No movies found.'}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home; 