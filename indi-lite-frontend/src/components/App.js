import React, { Component } from 'react';
import NavbarContainer from '../containers/NavbarContainer';
import PagesListContainer from '../containers/PagesListContainer';
import SessionsPage from './SessionsPage';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <NavbarContainer />
        <PagesListContainer navigationKey="section">
            <SessionsPage key="sessions" />
        </PagesListContainer>
      </div>
    );
  }
}

export default App;
