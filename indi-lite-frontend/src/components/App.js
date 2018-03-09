import React, { Component } from 'react';
import NavbarController from '../containers/NavbarController';
import PagesListController from '../containers/PagesListController';
import LoadingPage from '../containers/LoadingPage';
import SessionsPageController from '../containers/SessionsPageController';
import INDIServerController from '../containers/INDIServerController';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <NavbarController />
        <PagesListController navigationKey="section">
            <SessionsPageController key="sessions" />
            <INDIServerController key="indi_server" />
        </PagesListController>
        <LoadingPage />
      </div>
    );
  }
}

export default App;
