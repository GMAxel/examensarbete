// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'

const PrivateRoute = ({ component: Component, ...rest }) => {
    const {userData} = useContext(AuthContext);
    const isLoggedIn = userData.isAuthenticated;
    const isLoading = userData.isLoading;
  // Add your own authentication on the below line.
//   const isLoggedIn = AuthService.isLoggedIn()
    
  return (
    <Route
      {...rest}
      render={props =>
        !isLoading ? 
          isLoggedIn ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
          )
          :
          null
      }
    />
  )
}

export default PrivateRoute