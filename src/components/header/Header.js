import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import LogOut from './LogOut';
import { AuthContext } from '../../contexts/AuthContext';

// import logo from '../../assets/logo.png'

const Header = () => {
    const {userData} = useContext(AuthContext);

    const privateLinks = userData.isAuthenticated ?
        <li><Link to="/my-account">Mitt Konto</Link></li>
        : 
        <React.Fragment>
            <li><Link to="/create-account">Skapa Konto</Link></li>
            <li><Link to="/login">Logga In</Link></li>
        </React.Fragment>
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
                    <li><Link to="/chat">Chat</Link></li>
                    {privateLinks}
                </ul>
            </div>
            <LogOut />
        </div>
    )
}

export default Header;