// @flow
import React, { Component } from 'react';
import SimplePhoto from './SimplePhoto';
import DigitalClock from './DigitalClock';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <DigitalClock />
        <SimplePhoto />
      </div>
    );
  }
}

export default App;
