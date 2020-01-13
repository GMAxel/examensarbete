import React from 'react'
import { Link } from "react-router-dom";

// import logo from '../../assets/logo.png'

const Header = () => {
    return (
        <div className='header'>
            <div className='logo'>
                <h1>
                    <Link to="/">Tipline</Link>
                </h1>
            </div>
            <div className='menu'>
                <ul className='menuList'>
                    <li><Link to="/">Startsida</Link></li>
                    <li><Link to="/create-account">Skapa Konto</Link></li>
                    <li><Link to="/log-in">Logga In</Link></li>
                    <li><Link to="/my-account">Mitt Konto</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default Header;