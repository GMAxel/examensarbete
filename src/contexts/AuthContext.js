import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName:  '',
        username: '',
        id: '',
        isAuthenticated: false,
        logOut: false,
        accessToken: '',
        expiresIn: null,
        isLoading: true,
        description: ''        
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

    const onLogIn = (logInData) => {
        const {firstName, lastName, username, id, accessToken, expiresIn, description} = logInData;
        setUserData({
            firstName,
            lastName,
            username,
            id,
            isAuthenticated: true,
            accessToken,
            expiresIn,
            isLoading:false,
            description
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