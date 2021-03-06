// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'

const LoggedInRoute = ({ component: Component, ...rest }) => {
    const {userData} = useContext(AuthContext);
    const isLoggedIn = userData.isAuthenticated;
  // Add your own authentication on the below line.
//   const isLoggedIn = AuthService.isLoggedIn()

  return (
    <Route
      {...rest}
      render={props =>
        !isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )
      }
    />
  )
}

export default LoggedInRoute