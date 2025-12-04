import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TvShows.scss";

const apiKey = "7d61a6d8f1385de92535ac09fff03f9a";
const url = "https://api.themoviedb.org/3";
const imgUrl = "https://image.tmdb.org/t/p/original";

const TVShowCard = ({ show, onClick }) => {
  return (
    <div className="tv-card" onClick={onClick}>
      <img
        src={
          show.poster_path
            ? `${imgUrl}${show.poster_path}`
            : "https://via.placeholder.com/300x450?text=No+Image"
        }
        alt={show.name}
      />
      <div className="tv-card-overlay">
        <h3>{show.name}</h3>
        <div className="tv-card-meta">
          <span className="rating">⭐ {show.vote_average.toFixed(1)}</span>
          <span>{show.first_air_date?.split("-")[0]}</span>
        </div>
      </div>
    </div>
  );
};

const TVShows = () => {
  const navigate = useNavigate();
  const [popularShows, setPopularShows] = useState([]);
  const [topRatedShows, setTopRatedShows] = useState([]);
  const [airingToday, setAiringToday] = useState([]);
  const [onTheAir, setOnTheAir] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllShows = async () => {
      try {
        setLoading(true);

        const [popular, topRated, today, onAir, genreList] = await Promise.all([
          axios.get(`${url}/tv/popular?api_key=${apiKey}`),
          axios.get(`${url}/tv/top_rated?api_key=${apiKey}`),
          axios.get(`${url}/tv/airing_today?api_key=${apiKey}`),
          axios.get(`${url}/tv/on_the_air?api_key=${apiKey}`),
          axios.get(`${url}/genre/tv/list?api_key=${apiKey}`),
        ]);

        setPopularShows(popular.data.results);
        setTopRatedShows(topRated.data.results);
        setAiringToday(today.data.results);
        setOnTheAir(onAir.data.results);
        setGenres(genreList.data.genres);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
        setLoading(false);
      }
    };

    fetchAllShows();
  }, []);

  const handleShowClick = (id) => {
    navigate(`/tvshow/${id}`);
  };

  if (loading) {
    return <div className="loading">Loading TV Shows...</div>;
  }

  return (
    <div className="tvshows-page">
      {/* Hero Banner */}
      {popularShows[0] && (
        <div
          className="hero-banner"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(20,20,20,1)), url(${imgUrl}${popularShows[0].backdrop_path})`,
          }}
        >
          <div className="hero-content">
            <h1>{popularShows[0].name}</h1>
            <p>{popularShows[0].overview}</p>
            <div className="hero-buttons">
              <button onClick={() => handleShowClick(popularShows[0].id)}>
                ▶ Play
              </button>
              <button className="info-btn">ℹ More Info</button>
            </div>
          </div>
        </div>
      )}

      {/* TV Show Rows */}
      <div className="shows-container">
        <section className="show-row">
          <h2>Popular on Netflix</h2>
          <div className="show-grid">
            {popularShows.slice(1, 13).map((show) => (
              <TVShowCard
                key={show.id}
                show={show}
                onClick={() => handleShowClick(show.id)}
              />
            ))}
          </div>
        </section>

        <section className="show-row">
          <h2>Top Rated TV Shows</h2>
          <div className="show-grid">
            {topRatedShows.slice(0, 12).map((show) => (
              <TVShowCard
                key={show.id}
                show={show}
                onClick={() => handleShowClick(show.id)}
              />
            ))}
          </div>
        </section>

        <section className="show-row">
          <h2>Airing Today</h2>
          <div className="show-grid">
            {airingToday.slice(0, 12).map((show) => (
              <TVShowCard
                key={show.id}
                show={show}
                onClick={() => handleShowClick(show.id)}
              />
            ))}
          </div>
        </section>

        <section className="show-row">
          <h2>Currently On The Air</h2>
          <div className="show-grid">
            {onTheAir.slice(0, 12).map((show) => (
              <TVShowCard
                key={show.id}
                show={show}
                onClick={() => handleShowClick(show.id)}
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
                onClick={() => navigate(`/tvgenre/${genre.id}`)}
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

export default TVShows;