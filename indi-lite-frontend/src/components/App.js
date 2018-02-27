import React, { Component } from 'react';
import NavbarContainer from '../containers/NavbarContainer';
import PagesListController from '../containers/PagesListController';
import LoadingPage from '../containers/LoadingPage';
import SessionsPageController from '../containers/SessionsPageController';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <NavbarContainer />
        <PagesListController navigationKey="section">
            <SessionsPageController key="sessions" />
        </PagesListController>
        <LoadingPage />
      </div>
    );
  }
}

export default App;
