import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const LogOut = () => {
    const {onLogOut, userData} = useContext(AuthContext)   
    return (
        <div className="logOut">
            {userData.isAuthenticated && <button onClick={onLogOut}>Logga ut</button>}
        </div>
    )
}
export default LogOut;
