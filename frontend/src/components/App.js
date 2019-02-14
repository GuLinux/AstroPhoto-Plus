import React from 'react';
import { NavbarContainer } from '../Navigation/NavbarContainer';
import LoadingContainer from '../containers/LoadingContainer';
import SequencesPage from '../Sequences/SequencesPage';
import INDIServerContainer from '../INDI-Server/INDIServerContainer';
import NotificationsContainer from '../Notifications/NotificationsContainer';
import ErrorPageContainer from '../Errors/ErrorPageContainer';
import { CameraContainer } from '../Camera/CameraContainer';
import { SettingsContainer } from '../Settings/SettingsContainer';
import { ImagePage } from '../Image/ImagePage';
import { PlateSolvingPageContainer } from '../PlateSolving/PlateSolvingPageContainer';
import './App.css';
import { Route, Switch} from "react-router-dom";
import { Routes } from '../routes';
import { Home } from './Home';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { VersionCheckContainer } from '../Version/VersionCheckContainer';


const App = ({location}) => (
  <div className="App">
    <VersionCheckContainer />
    <NavbarContainer location={location}>
        <NotificationsContainer />
        <ErrorPageContainer>
          <TransitionGroup>
            <CSSTransition key={location.key} classNames='fade' timeout={500}>
              <Switch location={location}>
                <Route exact path={Routes.ROOT} component={Home}/>
                <Route path={Routes.SEQUENCES_PAGE} component={SequencesPage} />
                <Route path={Routes.INDI_PAGE} component={INDIServerContainer} />
                <Route path={Routes.CAMERA_PAGE} component={CameraContainer} />
                <Route path={Routes.PLATE_SOLVING_PAGE} component={PlateSolvingPageContainer} />
                <Route path={Routes.SETTINGS_PAGE} component={SettingsContainer} />
                <Route path={Routes.IMAGE_PAGE} render={({match, location}) => <ImagePage id={match.params.id} type={match.params.type} />} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        </ErrorPageContainer>
        <LoadingContainer />
    </NavbarContainer>
  </div>
);

export default App;
