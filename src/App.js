// @flow
import React, { Component } from 'react';
import SimplePhoto from './SimplePhoto';
import DigitalClock from './DigitalClock';
import DarkSkyWeather from './DarkSkyWeather';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <SimplePhoto />
        <DigitalClock />
        <DarkSkyWeather />
      </div>
    );
  }
}

export default App;
