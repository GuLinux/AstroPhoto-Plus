import React from 'react';
import Navbar from '../Navigation/Navbar';
import LoadingContainer from '../containers/LoadingContainer';
import SequencesPage from '../Sequences/SequencesPage';
import INDIServerContainer from '../INDI-Server/INDIServerContainer';
import NotificationsContainer from '../Notifications/NotificationsContainer';
import ErrorPageContainer from '../Errors/ErrorPageContainer';
import CameraContainer from '../Camera/CameraContainer';
import SettingsContainer from '../Settings/SettingsContainer';
import ImageContainer from '../Image/ImageContainer';

import './App.css';
import { Route, Redirect } from "react-router-dom";

const App = ({location}) => (
  <div className="App">
    <Navbar location={location}>
        <NotificationsContainer />
        <ErrorPageContainer>
            <Route exact path="/" render={() => <Redirect to="/sequences/all"/> }/>
            <Route path="/sequences" component={SequencesPage} />
            <Route path="/indi" component={INDIServerContainer} />
            <Route path="/camera" component={CameraContainer} />
            <Route path="/settings" component={SettingsContainer} />
            <Route path="/image/:type/:id" render={({match, location}) => <ImageContainer id={match.params.id} type={match.params.type} />} />
        </ErrorPageContainer>
        <LoadingContainer />
    </Navbar>
  </div>
);

export default App;
