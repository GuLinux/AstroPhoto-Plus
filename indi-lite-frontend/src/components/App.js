import React, { Component } from 'react';
import VisibleSessions from '../containers/VisibleSessions';
import AddSession from '../containers/AddSession';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">

        <VisibleSessions />
        <AddSession />

      </div>
    );
  }
}

export default App;
