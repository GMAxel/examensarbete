import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'

const PrivateRoute = ({ component: Component, ...rest }) => {
    const {userData} = useContext(AuthContext);
    const isLoggedIn = userData.isAuthenticated;
    const isLoading = userData.isLoading;    
  

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