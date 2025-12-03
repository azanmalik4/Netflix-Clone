import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RecentlyAdded.scss";

const apiKey = "7d61a6d8f1385de92535ac09fff03f9a";
const url = "https://api.themoviedb.org/3";
const imgUrl = "https://image.tmdb.org/t/p/original";

const RecentItem = ({ item, type, onClick }) => {
  return (
    <div className="recent-item" onClick={onClick}>
      <img
        src={
          item.poster_path
            ? `${imgUrl}${item.poster_path}`
            : "https://via.placeholder.com/300x450?text=No+Image"
        }
        alt={item.title || item.name}
      />
      <div className="recent-overlay">
        <div className="recent-badge">{type}</div>
        <h3>{item.title || item.name}</h3>
        <div className="recent-meta">
          <span className="rating">⭐ {item.vote_average.toFixed(1)}</span>
          <span>
            {(item.release_date || item.first_air_date)?.split("-")[0]}
          </span>
        </div>
        <p className="recent-overview">
          {item.overview?.substring(0, 150)}
          {item.overview?.length > 150 ? "..." : ""}
        </p>
      </div>
    </div>
  );
};

const RecentlyAdded = () => {
  const navigate = useNavigate();
  const [recentMovies, setRecentMovies] = useState([]);
  const [recentShows, setRecentShows] = useState([]);
  const [allRecent, setAllRecent] = useState([]);
  const [filter, setFilter] = useState("all"); // all, movies, tv
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentContent = async () => {
      try {
        setLoading(true);

        // Get current date and date from 30 days ago
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const todayStr = today.toISOString().split("T")[0];
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

        const [movies, shows] = await Promise.all([
          axios.get(
            `${url}/discover/movie?api_key=${apiKey}&sort_by=release_date.desc&release_date.lte=${todayStr}&release_date.gte=${thirtyDaysAgoStr}`
          ),
          axios.get(
            `${url}/discover/tv?api_key=${apiKey}&sort_by=first_air_date.desc&first_air_date.lte=${todayStr}&first_air_date.gte=${thirtyDaysAgoStr}`
          ),
        ]);

        setRecentMovies(movies.data.results);
        setRecentShows(shows.data.results);

        // Combine and sort by date
        const combined = [
          ...movies.data.results.map((m) => ({ ...m, type: "movie" })),
          ...shows.data.results.map((s) => ({ ...s, type: "tv" })),
        ].sort((a, b) => {
          const dateA = new Date(a.release_date || a.first_air_date);
          const dateB = new Date(b.release_date || b.first_air_date);
          return dateB - dateA;
        });

        setAllRecent(combined);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recent content:", error);
        setLoading(false);
      }
    };

    fetchRecentContent();
  }, []);

  const handleItemClick = (item) => {
    if (item.type === "movie") {
      navigate(`/movie/${item.id}`);
    } else {
      navigate(`/tvshow/${item.id}`);
    }
  };

  const getFilteredContent = () => {
    switch (filter) {
      case "movies":
        return recentMovies.map((m) => ({ ...m, type: "movie" }));
      case "tv":
        return recentShows.map((s) => ({ ...s, type: "tv" }));
      default:
        return allRecent;
    }
  };

  if (loading) {
    return <div className="loading">Loading Recently Added...</div>;
  }

  const filteredContent = getFilteredContent();

  return (
    <div className="recently-added-page">
      <div className="recent-header">
        <h1>Recently Added</h1>
        <p>New movies and TV shows from the last 30 days</p>

        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "movies" ? "active" : ""}
            onClick={() => setFilter("movies")}
          >
            Movies
          </button>
          <button
            className={filter === "tv" ? "active" : ""}
            onClick={() => setFilter("tv")}
          >
            TV Shows
          </button>
        </div>
      </div>

      <div className="recent-grid">
        {filteredContent.length > 0 ? (
          filteredContent.map((item) => (
            <RecentItem
              key={`${item.type}-${item.id}`}
              item={item}
              type={item.type === "movie" ? "MOVIE" : "TV SHOW"}
              onClick={() => handleItemClick(item)}
            />
          ))
        ) : (
          <div className="no-content">No recently added content found</div>
        )}
      </div>
    </div>
  );
};

export default RecentlyAdded;