import React from 'react';
import NavbarContainer from '../Navigation/NavbarContainer';
import LoadingContainer from '../containers/LoadingContainer';
import SequencesPage from '../Sequences/SequencesPage';
import INDIServerContainer from '../INDI-Server/INDIServerContainer';
import NotificationsContainer from '../Notifications/NotificationsContainer';
import ErrorPageContainer from '../Errors/ErrorPageContainer';
import CameraContainer from '../Camera/CameraContainer';
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
        <Route path="/camera" component={CameraContainer} />
    </ErrorPageContainer>
    <LoadingContainer />
  </div>
);

export default App;
