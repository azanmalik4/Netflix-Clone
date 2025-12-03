import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyList.scss";

const imgUrl = "https://image.tmdb.org/t/p/original";

const MyListItem = ({ item, onRemove, onClick }) => {
  return (
    <div className="mylist-item">
      <img
        src={
          item.poster_path
            ? `${imgUrl}${item.poster_path}`
            : "https://via.placeholder.com/300x450?text=No+Image"
        }
        alt={item.title || item.name}
        onClick={onClick}
      />
      <button className="remove-btn" onClick={(e) => {
        e.stopPropagation();
        onRemove(item.id);
      }}>
        ✕
      </button>
      <div className="mylist-overlay" onClick={onClick}>
        <h3>{item.title || item.name}</h3>
        <div className="mylist-meta">
          <span className="rating">⭐ {item.vote_average?.toFixed(1)}</span>
          <span className="type-badge">{item.type === "movie" ? "MOVIE" : "TV"}</span>
        </div>
      </div>
    </div>
  );
};

const MyList = () => {
  const navigate = useNavigate();
  const [myList, setMyList] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const savedList = localStorage.getItem("myNetflixList");
    if (savedList) {
      setMyList(JSON.parse(savedList));
    }
  }, []);

  const handleRemove = (id) => {
    const updatedList = myList.filter((item) => item.id !== id);
    setMyList(updatedList);
    localStorage.setItem("myNetflixList", JSON.stringify(updatedList));
  };

  const handleItemClick = (item) => {
    if (item.type === "movie") {
      navigate(`/movie/${item.id}`);
    } else {
      navigate(`/tvshow/${item.id}`);
    }
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire list?")) {
      setMyList([]);
      localStorage.removeItem("myNetflixList");
    }
  };

  const getFilteredList = () => {
    switch (filter) {
      case "movies":
        return myList.filter((item) => item.type === "movie");
      case "tv":
        return myList.filter((item) => item.type === "tv");
      default:
        return myList;
    }
  };

  const filteredList = getFilteredList();

  return (
    <div className="mylist-page">
      <div className="mylist-header">
        <div>
          <h1>My List</h1>
          <p>
            {myList.length} {myList.length === 1 ? "item" : "items"} in your list
          </p>
        </div>

        {myList.length > 0 && (
          <button className="clear-btn" onClick={clearAll}>
            Clear All
          </button>
        )}
      </div>

      {myList.length > 0 ? (
        <>
          <div className="filter-buttons">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All ({myList.length})
            </button>
            <button
              className={filter === "movies" ? "active" : ""}
              onClick={() => setFilter("movies")}
            >
              Movies ({myList.filter((i) => i.type === "movie").length})
            </button>
            <button
              className={filter === "tv" ? "active" : ""}
              onClick={() => setFilter("tv")}
            >
              TV Shows ({myList.filter((i) => i.type === "tv").length})
            </button>
          </div>

          <div className="mylist-grid">
            {filteredList.map((item) => (
              <MyListItem
                key={`${item.type}-${item.id}`}
                item={item}
                onRemove={handleRemove}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-list">
          <div className="empty-icon">📋</div>
          <h2>Your list is empty</h2>
          <p>Add movies and TV shows to your list to watch them later</p>
          <button onClick={() => navigate("/")}>Browse Content</button>
        </div>
      )}
    </div>
  );
};

export default MyList;