import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home"
import Header from './Components/Header/Header'
import MovieDetail from "./components/MovieDetails/MovieDetails";
import TVShows from "./components/TVShows/TvShows";
import TVShowDetail from "./components/TvShowDetails/TvShowDetails";
import TVGenrePage from "./components/TvGenreBox/TvGenreBox";
import Movies from "./components/Movies/Movies";
import RecentlyAdded from "./components/RecentlyAdded/RecentlyAdded";
import MyList from "./components/MyList/MyList";
import GenrePage from "./Components/GenrePage/GenrePage";
import "./App.scss";

function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/movie/:id" element={<MovieDetail/>} />
          <Route path="/genre/:id" element={<GenrePage/>} />
          <Route path="/tvshows" element={<TVShows/>} />
          <Route path="/tvshow/:id" element={<TVShowDetail/>} />
          <Route path="/tvgenre/:id" element={<TVGenrePage/>} />
          <Route path="/movies" element={<Movies/>} />
          <Route path="/recent" element={<RecentlyAdded/>} />
          <Route path="/mylist" element={<MyList/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;