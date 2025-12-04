import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TvGenreBox.scss"
import { MdArrowBack } from "react-icons/md";

const apiKey = "7d61a6d8f1385de92535ac09fff03f9a";
const url = "https://api.themoviedb.org/3";
const imgUrl = "https://image.tmdb.org/t/p/original";

const TVGenrePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [genreName, setGenreName] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchGenreName = async () => {
      try {
        const { data } = await axios.get(
          `${url}/genre/tv/list?api_key=${apiKey}`
        );
        const genre = data.genres.find((g) => g.id === parseInt(id));
        setGenreName(genre?.name || "Genre");
      } catch (error) {
        console.error("Error fetching genre name:", error);
      }
    };

    fetchGenreName();
  }, [id]);

  useEffect(() => {
    const fetchShowsByGenre = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${url}/discover/tv?api_key=${apiKey}&with_genres=${id}&page=${page}`
        );

        if (page === 1) {
          setShows(data.results);
        } else {
          setShows((prev) => [...prev, ...data.results]);
        }

        setHasMore(page < data.total_pages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching TV shows by genre:", error);
        setLoading(false);
      }
    };

    fetchShowsByGenre();
  }, [id, page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="tv-genre-page">
      <div className="genre-header">
        <button className="back-button" onClick={() => navigate("/tvshows")}>
          <MdArrowBack /> Back to TV Shows
        </button>
        <h1>{genreName} TV Shows</h1>
      </div>

      <div className="shows-grid">
        {shows.map((show) => (
          <div
            key={show.id}
            className="show-card"
            onClick={() => navigate(`/tvshow/${show.id}`)}
          >
            <img
              src={
                show.poster_path
                  ? `${imgUrl}/${show.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={show.name}
            />
            <div className="show-card-info">
              <h3>{show.name}</h3>
              <div className="show-card-meta">
                <span className="rating">⭐ {show.vote_average.toFixed(1)}</span>
                <span>{show.first_air_date?.split("-")[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="load-more-container">
          <button
            className="load-more-btn"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TVGenrePage;