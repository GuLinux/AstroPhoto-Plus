import React, { Component } from 'react';
import NavbarContainer from '../containers/NavbarContainer';
import PagesListContainer from '../containers/PagesListContainer';
import LoadingPage from '../containers/LoadingPage';
import SequencesPage from '../components/SequencesPage';
import INDIServerContainer from '../containers/INDIServerContainer';
import NotificationsContainer from '../containers/NotificationsContainer';
import ErrorPageContainer from '../containers/ErrorPageContainer';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <NavbarContainer />
        <NotificationsContainer />
        <PagesListContainer navigationKey="section">
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
