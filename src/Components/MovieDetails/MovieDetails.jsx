import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MovieDetails.scss";
import { CiPlay1 } from "react-icons/ci";
import { MdOutlinePlaylistAdd, MdArrowBack } from "react-icons/md";

const apiKey = "7d61a6d8f1385de92535ac09fff03f9a";
const url = "https://api.themoviedb.org/3";
const imgUrl = "https://image.tmdb.org/t/p/original";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${url}/movie/${id}?api_key=${apiKey}`
        );
        setMovie(data);
        const castData = await axios.get(
          `${url}/movie/${id}/credits?api_key=${apiKey}`
        );
        setCast(castData.data.cast.slice(0, 10));

        const similarData = await axios.get(
          `${url}/movie/${id}/similar?api_key=${apiKey}`
        );
        setSimilar(similarData.data.results.slice(0, 6));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!movie) {
    return <div className="error">Movie not found</div>;
  }

  return (
    <div className="movie-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        <MdArrowBack /> Back
      </button>

      <div
        className="movie-banner"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.9)), url(${imgUrl}/${movie.backdrop_path})`,
        }}
      >
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <div className="movie-meta">
            <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
            <span>{movie.release_date?.split("-")[0]}</span>
            <span>{movie.runtime} min</span>
          </div>
          <p className="overview">{movie.overview}</p>
          <div className="action-buttons">
            <button className="play-btn">
              <CiPlay1 /> Play
            </button>
            <button className="add-btn">
              <MdOutlinePlaylistAdd /> My List
            </button>
          </div>
          <div className="genres">
            {movie.genres?.map((genre) => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="movie-details-container">
        <div className="cast-section">
          <h2>Cast</h2>
          <div className="cast-grid">
            {cast.map((actor) => (
              <div key={actor.id} className="cast-card">
                {actor.profile_path ? (
                  <img
                    src={`${imgUrl}/${actor.profile_path}`}
                    alt={actor.name}
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <p className="actor-name">{actor.name}</p>
                <p className="character-name">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>

        {similar.length > 0 && (
          <div className="similar-section">
            <h2>Similar Movies</h2>
            <div className="similar-grid">
              {similar.map((item) => (
                <div
                  key={item.id}
                  className="similar-card"
                  onClick={() => navigate(`/movie/${item.id}`)}
                >
                  <img src={`${imgUrl}/${item.poster_path}`} alt={item.title} />
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
