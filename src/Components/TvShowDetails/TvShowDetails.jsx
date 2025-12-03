import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TVShowDetails.scss";
import { CiPlay1 } from "react-icons/ci";
import { MdOutlinePlaylistAdd, MdArrowBack, MdCheck } from "react-icons/md";

const apiKey = "7d61a6d8f1385de92535ac09fff03f9a";
const url = "https://api.themoviedb.org/3";
const imgUrl = "https://image.tmdb.org/t/p/original";

const TVShowDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inMyList, setInMyList] = useState(false);

  useEffect(() => {
    const fetchShowDetail = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${url}/tv/${id}?api_key=${apiKey}`);
        setShow(data);

        const castData = await axios.get(
          `${url}/tv/${id}/credits?api_key=${apiKey}`
        );
        setCast(castData.data.cast.slice(0, 10));

        const similarData = await axios.get(
          `${url}/tv/${id}/similar?api_key=${apiKey}`
        );
        setSimilar(similarData.data.results.slice(0, 6));

        // Check if in my list
        const savedList = localStorage.getItem("myNetflixList");
        if (savedList) {
          const list = JSON.parse(savedList);
          setInMyList(list.some((item) => item.id === parseInt(id) && item.type === "tv"));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching TV show details:", error);
        setLoading(false);
      }
    };

    fetchShowDetail();
  }, [id]);

  const toggleMyList = () => {
    const savedList = localStorage.getItem("myNetflixList");
    let list = savedList ? JSON.parse(savedList) : [];

    if (inMyList) {
      list = list.filter((item) => !(item.id === show.id && item.type === "tv"));
      setInMyList(false);
    } else {
      list.push({ ...show, type: "tv" });
      setInMyList(true);
    }

    localStorage.setItem("myNetflixList", JSON.stringify(list));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!show) {
    return <div className="error">TV Show not found</div>;
  }

  return (
    <div className="tvshow-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        <MdArrowBack /> Back
      </button>

      <div
        className="show-banner"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.9)), url(${imgUrl}/${show.backdrop_path})`,
        }}
      >
        <div className="show-info">
          <h1>{show.name}</h1>
          <div className="show-meta">
            <span className="rating">⭐ {show.vote_average.toFixed(1)}</span>
            <span>{show.first_air_date?.split("-")[0]}</span>
            <span>{show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}</span>
            <span>{show.number_of_episodes} Episodes</span>
          </div>
          <p className="overview">{show.overview}</p>
          <div className="action-buttons">
            <button className="play-btn">
              <CiPlay1 /> Play
            </button>
            <button className="add-btn" onClick={toggleMyList}>
              {inMyList ? <MdCheck /> : <MdOutlinePlaylistAdd />}
              {inMyList ? "In My List" : "My List"}
            </button>
          </div>
          <div className="genres">
            {show.genres?.map((genre) => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="show-details-container">
        <div className="show-stats">
          <div className="stat-item">
            <h3>Status</h3>
            <p>{show.status}</p>
          </div>
          <div className="stat-item">
            <h3>Network</h3>
            <p>{show.networks?.[0]?.name || "N/A"}</p>
          </div>
          <div className="stat-item">
            <h3>Type</h3>
            <p>{show.type}</p>
          </div>
        </div>

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
            <h2>Similar TV Shows</h2>
            <div className="similar-grid">
              {similar.map((item) => (
                <div
                  key={item.id}
                  className="similar-card"
                  onClick={() => navigate(`/tvshow/${item.id}`)}
                >
                  <img
                    src={`${imgUrl}/${item.poster_path}`}
                    alt={item.name}
                  />
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TVShowDetail;