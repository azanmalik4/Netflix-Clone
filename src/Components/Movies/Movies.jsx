import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Movies.scss";

const apiKey = "7d61a6d8f1385de92535ac09fff03f9a";
const url = "https://api.themoviedb.org/3";
const imgUrl = "https://image.tmdb.org/t/p/original";

const MovieCard = ({ movie, onClick }) => {
  return (
    <div className="movie-card-item" onClick={onClick}>
      <img
        src={
          movie.poster_path
            ? `${imgUrl}${movie.poster_path}`
            : "https://via.placeholder.com/300x450?text=No+Image"
        }
        alt={movie.title}
      />
      <div className="movie-card-overlay">
        <h3>{movie.title}</h3>
        <div className="movie-card-meta">
          <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
          <span>{movie.release_date?.split("-")[0]}</span>
        </div>
      </div>
    </div>
  );
};

const Movies = () => {
  const navigate = useNavigate();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        setLoading(true);

        const [trending, popular, topRated, upcoming, nowPlaying, genreList] =
          await Promise.all([
            axios.get(`${url}/trending/movie/week?api_key=${apiKey}`),
            axios.get(`${url}/movie/popular?api_key=${apiKey}`),
            axios.get(`${url}/movie/top_rated?api_key=${apiKey}`),
            axios.get(`${url}/movie/upcoming?api_key=${apiKey}`),
            axios.get(`${url}/movie/now_playing?api_key=${apiKey}`),
            axios.get(`${url}/genre/movie/list?api_key=${apiKey}`),
          ]);

        setTrendingMovies(trending.data.results);
        setPopularMovies(popular.data.results);
        setTopRatedMovies(topRated.data.results);
        setUpcomingMovies(upcoming.data.results);
        setNowPlayingMovies(nowPlaying.data.results);
        setGenres(genreList.data.genres);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  if (loading) {
    return <div className="loading">Loading Movies...</div>;
  }

  return (
    <div className="movies-page">
      {trendingMovies[0] && (
        <div
          className="hero-banner"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(20,20,20,1)), url(${imgUrl}${trendingMovies[0].backdrop_path})`,
          }}
        >
          <div className="hero-content">
            <h1>{trendingMovies[0].title}</h1>
            <p>{trendingMovies[0].overview}</p>
            <div className="hero-buttons">
              <button onClick={() => handleMovieClick(trendingMovies[0].id)}>
                ▶ Play
              </button>
              <button className="info-btn">ℹ More Info</button>
            </div>
          </div>
        </div>
      )}

      <div className="movies-container">
        <section className="movie-row">
          <h2>Trending This Week</h2>
          <div className="movie-grid">
            {trendingMovies.slice(1, 13).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => handleMovieClick(movie.id)}
              />
            ))}
          </div>
        </section>

        <section className="movie-row">
          <h2>Popular Movies</h2>
          <div className="movie-grid">
            {popularMovies.slice(0, 12).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => handleMovieClick(movie.id)}
              />
            ))}
          </div>
        </section>

        <section className="movie-row">
          <h2>Top Rated Movies</h2>
          <div className="movie-grid">
            {topRatedMovies.slice(0, 12).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => handleMovieClick(movie.id)}
              />
            ))}
          </div>
        </section>

        <section className="movie-row">
          <h2>Now Playing in Theaters</h2>
          <div className="movie-grid">
            {nowPlayingMovies.slice(0, 12).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => handleMovieClick(movie.id)}
              />
            ))}
          </div>
        </section>

        <section className="movie-row">
          <h2>Coming Soon</h2>
          <div className="movie-grid">
            {upcomingMovies.slice(0, 12).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => handleMovieClick(movie.id)}
              />
            ))}
          </div>
        </section>

        {/* Genre Section */}
        <section className="genres-section">
          <h2>Browse by Genre</h2>
          <div className="genre-tags">
            {genres.map((genre) => (
              <button
                key={genre.id}
                className="genre-tag"
                onClick={() => navigate(`/genre/${genre.id}`)}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Movies;