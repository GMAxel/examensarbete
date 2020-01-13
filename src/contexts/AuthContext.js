import React, { createContext, useState, useEffect } from 'react';
import Axios from 'axios';
const API_PATH = 'http://localhost/wies/examensarbete/examensarbete/api/queryHandler.php'

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [firstName, setFirstName] = useState(window.localStorage.getItem('firstName'));
    const [lastName, setLastName] = useState(window.localStorage.getItem('lastName'));
    const [username, setUsername] = useState(window.localStorage.getItem('userName'));

    const [id, setId] = useState(null);

    const onLogIn = (userData) => {
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setId(userData.id);
        setUsername(userData.username)
        setIsAuthenticated(true);
        // window.localStorage.setItem('firstName', response.data.firstName);
        // window.localStorage.setItem('lastName', response.data.lastName);
        // window.localStorage.setItem('username', response.data.username);
    }

    const onLogOut = () => {
        window.localStorage.clear();
    }

    useEffect(() => {
        Axios.get(API_PATH, {
            action: 'checkLoggedIn'
        })
        .then((response) => {
            console.log(response)
            // Rerouta användaren vid sucess.
        })
        .catch((error) => {
            console.log(error.response);
            // Visa felet för användaren.
        })
        .finally(function () {
            // always executed
        });
    })
    
    return (
        <AuthContext.Provider value={{isAuthenticated, onLogIn, onLogOut, firstName, lastName, id, username}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;