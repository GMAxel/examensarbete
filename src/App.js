import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from './components/header/Header'
import MainContent from './components/mainContent/MainContent'
import Footer from './components/footer/Footer'
import CreateAccount from './components/mainContent/CreateAccountForm'
import LogIn from './components/mainContent/LogIn';
import MyAccount from './components/mainContent/MyAccount';
import DataProvider from './contexts/DataProvider';


function App() {
  return (
    <Router>
      <DataProvider>
      <div className='app'>
        <Header />
        <Switch>
          <Route exact path="/" component={MainContent} />
          <Route path="/create-account" component={CreateAccount} />
          <Route path="/log-in" component={LogIn} />
          <Route path="/my-account" component={MyAccount} />
        </Switch>
        <Footer />
      </div>
      </DataProvider >
    </Router>
  );
}
export default App;