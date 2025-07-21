import React, { useState, useContext } from 'react';
import { MovieContext } from '../context/MovieContext';
import '../styles/SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { searchMovies } = useContext(MovieContext);

  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies(query);
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
        />
        <button type="submit" className="search-button">
          <i className="fas fa-search"></i> {/* FontAwesome search icon */}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;