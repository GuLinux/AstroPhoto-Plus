import React, { Component } from 'react';
import NavbarContainer from '../containers/NavbarContainer';
import PagesListContainer from '../containers/PagesListContainer';
import LoadingPage from '../containers/LoadingPage';
import SessionsPageContainer from '../containers/SessionsPageContainer';
import INDIServerContainer from '../containers/INDIServerContainer';
import NotificationsContainer from '../containers/NotificationsContainer';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <NavbarContainer />
        <NotificationsContainer />
        <PagesListContainer navigationKey="section">
            <SessionsPageContainer key="sessions" />
            <INDIServerContainer key="indi_server" />
        </PagesListContainer>
        <LoadingPage />
      </div>
    );
  }
}

export default App;
