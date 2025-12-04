import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home"
import Header from './Components/Header/Header'
import MovieDetail from "./Components/MovieDetails/MovieDetails";
import TVShows from "./Components/TVShows/TvShows";
import TVShowDetail from "./Components/TvShowDetails/TvShowDetails";
import TVGenrePage from "./Components/TvGenreBox/TvGenreBox";
import Movies from "./Components/Movies/Movies";
import RecentlyAdded from "./Components/RecentlyAdded/RecentlyAdded";
import MyList from "./Components/MyList/MyList";
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