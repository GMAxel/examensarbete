import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import menuButton from "./menuButton.png"
import LogOut from './LogOut';
import { AuthContext } from '../../contexts/AuthContext';
// import logo from '../../assets/logo.png'

const Header = () => {
    const {userData} = useContext(AuthContext);

    const active = true;

    const menuClass = active ? 'menuListActive':
        'menuListNotActive';

    const privateLinks = userData.isAuthenticated ?
        <React.Fragment>
            <li><Link to="/my-account">Mitt Konto</Link></li>
            <li><Link to="/chat">Chat</Link></li>
        </React.Fragment>
        : 
        <React.Fragment>
            <li><Link to="/login">Logga In</Link></li>
            <li><Link to="/signup">Skapa Konto</Link></li>
        </React.Fragment>
    return (
        <div className='header'>
            <div className='logo'>
                <h1>
                    <Link to="/">Tipline</Link>
                </h1>
            </div>
            <div className='menu'>
                <img className="menuButton" src={menuButton}/>
                <ul className={'menuList ' + menuClass}>
                    <li><Link to="/">Startsida</Link></li>
                    <li><Link to="/findusers">Hitta användare</Link></li>
                    {privateLinks}
                </ul>
            </div>
            <LogOut />
        </div>
    )
}

export default Header;