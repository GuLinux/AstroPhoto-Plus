import React from 'react';
import { Navbar } from '../Navigation/Navbar';
import LoadingContainer from '../containers/LoadingContainer';
import SequencesPage from '../Sequences/SequencesPage';
import INDIServerContainer from '../INDI-Server/INDIServerContainer';
import NotificationsContainer from '../Notifications/NotificationsContainer';
import ErrorPageContainer from '../Errors/ErrorPageContainer';
import { CameraContainer } from '../Camera/CameraContainer';
import SettingsContainer from '../Settings/SettingsContainer';
import { ImageContainer } from '../Image/ImageContainer';
import { PlateSolvingContainer } from '../PlateSolving/PlateSolvingContainer';
import './App.css';
import { Route, Redirect } from "react-router-dom";
import { Routes } from '../routes';
import { CelestialComponent } from '../components/Celestial';

const celestialConfig = {
  center: [65, -1],
  adaptable: true,
  stars: {
    colors: false,
  },
};

const App = ({location}) => (
  <div className="App">
    <Navbar location={location}>
        <NotificationsContainer />
        <ErrorPageContainer>
            <Route exact path={Routes.ROOT} render={() => <Redirect to={Routes.SEQUENCES_LIST} /> }/>
            <Route path={Routes.SEQUENCES_PAGE} component={SequencesPage} />
            <Route path={Routes.INDI_PAGE} component={INDIServerContainer} />
            <Route path={Routes.CAMERA_PAGE} component={CameraContainer} />
            <Route path={Routes.PLATE_SOLVING_PAGE} component={PlateSolvingContainer} />
            <Route path={Routes.SETTINGS_PAGE} component={SettingsContainer} />
            <Route path={Routes.IMAGE_PAGE} render={({match, location}) => <ImageContainer id={match.params.id} type={match.params.type} />} />
            <Route path='/celestial' render={() => (
              <CelestialComponent config={celestialConfig}>
                <CelestialComponent.Point ra={12.5} dec={-10} name='Hello!'/>
              </CelestialComponent>)
              } />
        </ErrorPageContainer>
        <LoadingContainer />
    </Navbar>
  </div>
);

export default App;
