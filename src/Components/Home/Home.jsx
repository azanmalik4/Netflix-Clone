import React, { useEffect, useState } from "react";
import "./Home.scss";
// import movie_Logo from "../../assets/movie_cover1.webp";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { CiPlay1 } from "react-icons/ci";
import { MdOutlinePlaylistAdd } from "react-icons/md";

const apiKey = "7d61a6d8f1385de92535ac09fff03f9a";
const url = "https://api.themoviedb.org/3";
const upComing = "upcoming";
const imgUrl = "https://image.tmdb.org/t/p/original";
const nowPlaying = "now_playing";
const popular = "popular";
const topRated = "top_Rated";

const Card = ({ img }) => {
  return <img className="card" src={img} alt="image" />;
};

const Row = ({ title, arr = [] }) => {
  return (
    <div className="row">
      <h1>{title}</h1>
      <div>
        {arr.map((item, index) => (
          <Card key={index} img={`${imgUrl}/${item.poster_path}`} />
        ))}
      </div>
    </div>
  );
};
const Home = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setnowPlayingMovies] = useState([]);
  const [popularMovies, setpopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [genre, setGenre] = useState([]);

  useEffect(() => {
    const fetchUpComing = async () => {
      const {
        data: { results },
      } = await axios.get(`${url}/movie/${upComing}?api_key=${apiKey}`);
      setUpcomingMovies(results);
    };

    const fetchnowPlaying = async () => {
      const {
        data: { results },
      } = await axios.get(
        `${url}/movie/${nowPlaying}?api_key=${apiKey}&page=2`
      );
      console.log(results);
      setnowPlayingMovies(results);
    };

    const fetchpopular = async () => {
      const {
        data: { results },
      } = await axios.get(`${url}/movie/${popular}?api_key=${apiKey}`);
      console.log(results);
      setpopularMovies(results);
    };

    const fetchtopRated = async () => {
      const {
        data: { results },
      } = await axios.get(`${url}/movie/${topRated}?api_key=${apiKey}`);
      console.log(results);
      setTopRatedMovies(results);
    };

    const getAllGenre = async () => {
      const {
        data: { genres },
      } = await axios.get(`${url}/genre/movie/list?api_key=${apiKey}`);
      console.log(genres);
      setGenre(genres);
    };

    getAllGenre();
    fetchUpComing();
    fetchnowPlaying();
    fetchpopular();
    fetchtopRated();
  }, []);

  return (
    <section className="home">
      <div
        className="banner"
        style={{
          backgroundImage: popularMovies[0]? `url(${`${imgUrl}/${popularMovies[0].poster_path}`})`: "rgb(16,16,16)",
        }}
      >
        {popularMovies[0] && <h1>{popularMovies[0].original_title}</h1>}
        {popularMovies[0] && <p>{popularMovies[0].overview}</p>}
        <div>
          <button>
            <CiPlay1 />
            Play{" "}
          </button>
          <button>
            My List <MdOutlinePlaylistAdd />{" "}
          </button>
        </div>
      </div>
      <Row title={"UpComing movies on Netflix"} arr={upcomingMovies} />
      <Row title={"Now Playing on Netflix"} arr={nowPlayingMovies} />
      <Row title={"Popular on Netflix"} arr={popularMovies} />
      <Row title={"Genre"} arr={topRatedMovies} />

      <div className="genreBox">
        {genre.map((item) => {
          return (
            <Link key={item.id} to={`/genre/${item.id}`}>
              {item.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Home;
