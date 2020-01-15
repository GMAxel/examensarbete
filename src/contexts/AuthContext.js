import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName:  '',
        username: '',
        id: '',
        isAuthenticated: false,
        logOut: false        
    })
    /**
     * Sätta default värde med
     * firstname: JSON.parse(sessionStorage.getItem('userData')).firstName;?
     */
    useEffect(() => {
        // Om användaren inte är autentiserad, 
        // Det finns en session. 
        // Användaren har inte tryckt på att logga ut, 
        // skapa state från sessionStorage.
        if(!userData.isAuthenticated && sessionStorage.getItem('userData') 
        && !userData.logOut) {
            setUserData(JSON.parse(sessionStorage.getItem('userData')));
        }
        // Om användaren är autentiserad lagra state i sessionstorage.
        if(userData.isAuthenticated) {
            sessionStorage.setItem('userData', JSON.stringify(userData));
        } 
        // Om användaren inte är autentiserad, 
        // det finns data i state,
        // 
        else if(userData.firstName !== ''){
            sessionStorage.setItem("userData", '');
            sessionStorage.clear();
        }
    }, [userData])

    const onLogIn = (userData) => {
        const {firstName, lastName, username, id} = userData;
        setUserData({
            firstName,
            lastName,
            username,
            id,
            isAuthenticated: true
        })
    }
    const onLogOut = () => {
        setUserData({isAuthenticated: false, logOut: true});
    }
    return (
        <AuthContext.Provider value={{ onLogIn, onLogOut, userData }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;