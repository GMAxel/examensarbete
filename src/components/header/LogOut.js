import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const LogOut = () => {
    const {onLogOut} = useContext(AuthContext)   
    return (
        <div className="logOut">
            <button onClick={onLogOut}>Logga ut</button>
        </div>
    )
}
export default LogOut;
