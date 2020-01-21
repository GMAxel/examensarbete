import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from './components/header/Header'
import Start from './components/mainContent/MainContent'
import Footer from './components/footer/Footer'
import SignUp from './components/mainContent/SignUp'
import LogIn from './components/mainContent/LogIn';
import MyAccount from './components/mainContent/MyAccount'
import AuthContextProvider  from './contexts/AuthContext';
import PrivateRoute from './PrivateRoute';
import LoggedInRoute from './LoggedInRoute';
import FindUsers from './components/mainContent/FindUsers2';
import Chat from './components/mainContent/chat4/Chat.js';
import UserAccount from './components/mainContent/userAccount/UserAccount';
import Booking from './components/mainContent/booking/Booking';



function App() {
  return (
    <Router>
      <div className='app'>
        <AuthContextProvider >
            <Header />
            <Switch>
              <Route exact path="/" component={Start} />
              <Route exact path="/findusers" component={FindUsers} />
              <LoggedInRoute path="/login" component={LogIn} />
              <LoggedInRoute path="/signup" component={SignUp} />
              <PrivateRoute path="/my-account" component={MyAccount} />
              <PrivateRoute path="/chat" component={Chat} />
              <Route path="/user/:id" component={UserAccount}/>
              <PrivateRoute path="/booking" component={Booking}/>
            </Switch>
            <Footer />
        </AuthContextProvider>
      </div>
    </Router>
  );
}
export default App;