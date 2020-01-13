import React from 'react';
import Axios from 'axios';
const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'


const LogOut = (props) => {
    const handleClick = () => {
        Axios.get(API_PATH, {
            action: 'logOut'
        })
        .then((response) => {
            console.log(response)
            console.log('logga då')
            props.history.push('/log-in')
            // Rerouta användaren vid sucess.
        })
        .catch((error) => {
            console.log(error.response);
            // Visa felet för användaren.
        })
        .finally(function () {
            // always executed
        });
    }
    
    return (
        <div className="logOut">
            <button onClick={() => handleClick}>Logga ut</button>
        </div>
    )
}

export default LogOut;
