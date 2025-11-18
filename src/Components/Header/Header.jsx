import React from 'react'
import logonetflix from '../../assets/Logonetflix.png'
import {Link} from "react-router-dom"
import { IoSearchOutline } from "react-icons/io5";
import "./Header.scss"

const  Header = () => {
  return (
    <nav className="header">
        <img src={logonetflix} alt="Netflix logo" />
        <div className='Tabs'>
        <Link to={"/tvshows"} >TV Shows</Link>
        <Link to={"/movies"} >Movies</Link>
        <Link to={"/recent"} >Recently Added</Link>
        <Link to={"/mylist"} >My List</Link>
        </div>
        <IoSearchOutline className='Icon1'/>
    </nav>
  )
}

export default  Header