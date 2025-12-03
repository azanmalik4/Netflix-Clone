import React, { useState, useEffect } from 'react'
import logonetflix from '../../assets/Logonetflix.png'
import { Link } from "react-router-dom"
import { IoSearchOutline } from "react-icons/io5";
import "./Header.scss"

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`header ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className='logo-link'>
        <img className='header_img' src={logonetflix} alt="Netflix logo" />
      </Link>

      <div className='Tabs'>
        <Link to="/tvshows">TV Shows</Link>
        <Link to="/movies">Movies</Link>
        <Link to="/recent">Recently Added</Link>
        <Link to="/mylist">My List</Link>
      </div>
      <IoSearchOutline className='Icon1'/>
    </nav>
  )
}

export default Header