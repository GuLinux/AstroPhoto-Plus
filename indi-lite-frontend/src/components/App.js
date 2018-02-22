import React, { Component } from 'react';
import './App.css';
import VisibleSequences from '../containers/VisibleSequences';

class App extends Component {
  render() {
    return (
      <div className="App">
        <p>Hello, React!</p>
        <VisibleSequences />
      </div>
    );
  }
}

export default App;
