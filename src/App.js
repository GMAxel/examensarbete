import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from './components/header/Header'
import Start from './components/mainContent/MainContent'
import Footer from './components/footer/Footer'
import SignUp from './components/mainContent/SignUp'
import LogIn from './components/mainContent/Start';
import MyAccount from './components/mainContent/MyAccount';
import AuthContextProvider  from './contexts/AuthContext';
import PrivateRoute from './PrivateRoute';
import LoggedInRoute from './LoggedInRoute';

function App() {
  return (
    <Router>
      <div className='app'>
        <AuthContextProvider >
            <Header />
            <Switch>
              <Route exact path="/" component={Start} />
              <LoggedInRoute path="/login" component={LogIn} />
              <LoggedInRoute path="/create-account" component={SignUp} />
              <PrivateRoute path="/my-account" component={MyAccount} />
            </Switch>
            <Footer />
        </AuthContextProvider>
      </div>
    </Router>
  );
}
export default App;