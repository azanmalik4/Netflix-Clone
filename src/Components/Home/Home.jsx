import React, { useEffect, useState } from "react";
import "./Home.scss";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { CiPlay1 } from "react-icons/ci";
import { MdOutlinePlaylistAdd } from "react-icons/md";

const apiKey = "7d61a6d8f1385de92535ac09fff03f9a";
const url = "https://api.themoviedb.org/3";
const upComing = "upcoming";
const imgUrl = "https://image.tmdb.org/t/p/original";
const nowPlaying = "now_playing";
const popular = "popular";
const topRated = "top_rated";

const Card = ({ img, id }) => {
  const navigate = useNavigate();
  
  return (
    <div className="card-wrapper">
      <img
        className="card"
        src={img}
        alt="movie"
        onClick={() => navigate(`/movie/${id}`)}
      />
    </div>
  );
};

const Row = ({ title, arr = [] }) => {
  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row-cards">
        {arr.map((item) => (
          <Card
            key={item.id}
            id={item.id}
            img={`${imgUrl}/${item.poster_path}`}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setnowPlayingMovies] = useState([]);
  const [popularMovies, setpopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [genre, setGenre] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const [upcoming, nowPlay, pop, topRate, genreList] = await Promise.all([
          axios.get(`${url}/movie/${upComing}?api_key=${apiKey}`),
          axios.get(`${url}/movie/${nowPlaying}?api_key=${apiKey}&page=1`),
          axios.get(`${url}/movie/${popular}?api_key=${apiKey}`),
          axios.get(`${url}/movie/${topRated}?api_key=${apiKey}`),
          axios.get(`${url}/genre/movie/list?api_key=${apiKey}`),
        ]);

        setUpcomingMovies(upcoming.data.results);
        setnowPlayingMovies(nowPlay.data.results);
        setpopularMovies(pop.data.results);
        setTopRatedMovies(topRate.data.results);
        setGenre(genreList.data.genres);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <section className="home">

      <div
        className="banner"
        style={{
          backgroundImage: popularMovies[0]
            ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(20,20,20,1)), url(${imgUrl}/${popularMovies[0].backdrop_path || popularMovies[0].poster_path})`
            : "linear-gradient(to bottom, rgb(20,20,20), rgb(20,20,20))",
        }}
      >
        <div className="banner-content">
          {popularMovies[0] && (
            <>
              <h1 className="banner-title">{popularMovies[0].original_title}</h1>
              <div className="banner-meta">
                <span className="rating">⭐ {popularMovies[0].vote_average.toFixed(1)}</span>
                <span className="year">{popularMovies[0].release_date?.split("-")[0]}</span>
              </div>
              <p className="banner-overview">{popularMovies[0].overview}</p>
              <div className="banner-buttons">
                <button
                  className="btn-play"
                  onClick={() => navigate(`/movie/${popularMovies[0].id}`)}
                >
                  <CiPlay1 /> Play
                </button>
                <button className="btn-info">
                  <MdOutlinePlaylistAdd /> My List
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      
      <div className="home-content">
        <Row title={"Popular on Netflix"} arr={popularMovies} />
        <Row title={"Now Playing"} arr={nowPlayingMovies} />
        <Row title={"Upcoming Movies"} arr={upcomingMovies} />
        <Row title={"Top Rated Movies"} arr={topRatedMovies} />

        <div className="genre-section">
          <h2>Browse by Genre</h2>
          <div className="genreBox">
            {genre.map((item) => (
              <Link key={item.id} to={`/genre/${item.id}`} className="genre-link">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;