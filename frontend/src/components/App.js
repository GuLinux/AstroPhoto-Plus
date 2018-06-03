import React, { Component } from 'react';
import NavbarContainer from '../Navigation/NavbarContainer';
import PagesListContainer from '../Navigation/PagesListContainer';
import LoadingPage from '../containers/LoadingPage';
import SequencesPage from '../Sequences/SequencesPage';
import INDIServerContainer from '../INDI-Server/INDIServerContainer';
import NotificationsContainer from '../Notifications/NotificationsContainer';
import ErrorPageContainer from '../Errors/ErrorPageContainer';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <NavbarContainer />
        <NotificationsContainer />
        <PagesListContainer navigation="section">
            <SequencesPage key="sequences" />
            <INDIServerContainer key="indi_server" />
            <ErrorPageContainer key="error_page" />
        </PagesListContainer>
        <LoadingPage />
      </div>
    );
  }
}

export default App;
