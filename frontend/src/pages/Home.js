import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import '../styles/Banner.css';
import '../styles/Movie.css'

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=`
      );
      setMovies(response.data.results);
    };
    fetchMovies();
  }, []);

  return (
    <div className="home-page">
      <h2 id="pageHeader">Popular Movies</h2>
      <div className="movie-list">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Home;
