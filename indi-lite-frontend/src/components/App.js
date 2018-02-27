import React, { Component } from 'react';
import NavbarContainer from '../containers/NavbarContainer';
import PagesListContainer from '../containers/PagesListContainer';
import LoadingPage from '../containers/LoadingPage';
import SessionsPageController from '../containers/SessionsPageController';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <NavbarContainer />
        <PagesListContainer navigationKey="section">
            <SessionsPageController key="sessions" />
        </PagesListContainer>
        <LoadingPage />
      </div>
    );
  }
}

export default App;
