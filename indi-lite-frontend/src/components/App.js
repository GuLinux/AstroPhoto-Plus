import React, { Component } from 'react';
import './App.css';
import VisibleSequences from '../containers/VisibleSequences';
import AddSequence from '../containers/AddSequence';

class App extends Component {
  render() {
    return (
      <div className="App">
        <VisibleSequences />
        <AddSequence />
      </div>
    );
  }
}

export default App;
