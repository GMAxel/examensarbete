import React, { useContext, useState } from 'react'
import { Link } from "react-router-dom";
import menuButton from "./menuButtonWhite2.png"
import LogOut from './LogOut';
import { AuthContext } from '../../contexts/AuthContext';
// import logo from '../../assets/logo.png'

const Header = () => {
    const {userData} = useContext(AuthContext);
    const [menuOpened, setMenuOpened] = useState(false);

    const menuClass = menuOpened ? 'menuListActive':
        'menuListNotActive';
    const logoClass = menuOpened ? 'logoActive' :
        'logoNotActive';
    const buttonClass = menuOpened ? 'buttonClicked' :
        'buttonUnclicked';

    const handleClick = () => {
        setMenuOpened(!menuOpened);
    }
    const handleLinkClick = () => {
        setMenuOpened(!menuOpened);
    }

    const privateLinks = userData.isAuthenticated ?
        <React.Fragment>
            <li onClick={handleLinkClick}><Link to="/chat">Chat</Link></li>
            <li onClick={handleLinkClick}><Link to="/my-account">Mitt Konto</Link></li>
            <li onClick={handleLinkClick}><Link to="/my-meetings">Mina Möten</Link></li>
        </React.Fragment>
        : 
        <React.Fragment>
            <li onClick={handleLinkClick}><Link to="/login">Logga In</Link></li>
            <li onClick={handleLinkClick}><Link to="/signup">Skapa Konto</Link></li>
        </React.Fragment>
    return (
        <div className='header'>
            <div className='logo'>
                <h1>
                    <Link to="/">Tipline</Link>
                </h1>
            </div>

            <div className={'menu'}>
                <button 
                    onClick={handleClick}
                    className={"menuButton " + buttonClass}
                >
                    <img src={menuButton}/>
                </button>
                <ul onClick={handleLinkClick} className={'menuList ' + menuClass}>
                    <li onClick={handleLinkClick} className="logoLi"><h1 className={logoClass}> Tipline</h1></li>
                    <li onClick={handleLinkClick} ><Link to="/">Startsida</Link></li>
                    <li onClick={handleLinkClick} ><Link to="/findusers">Hitta användare</Link></li>
                    {privateLinks}
                </ul>
            </div>
            <LogOut />
        </div>
    )
}

export default Header;