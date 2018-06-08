import React, { Component } from 'react';
import NavbarContainer from '../Navigation/NavbarContainer';
import PagesListContainer from '../Navigation/PagesListContainer';
import LoadingPage from '../containers/LoadingPage';
import SequencesPage from '../Sequences/SequencesPage';
import INDIServerContainer from '../INDI-Server/INDIServerContainer';
import NotificationsContainer from '../Notifications/NotificationsContainer';
import ErrorPageContainer from '../Errors/ErrorPageContainer';
import './App.css';
import { Route, Redirect } from "react-router-dom";

const App = ({location}) => (
  <div className="App">
    <NavbarContainer location={location} />
    <NotificationsContainer />
    <ErrorPageContainer>
        <Route exact path="/" render={() => <Redirect to="/sequences"/> }/>
        <Route path="/sequences" component={SequencesPage} /> 
        <Route path="/indi" component={INDIServerContainer} /> 
    </ErrorPageContainer>
    <LoadingPage />
  </div>
);

export default App;
