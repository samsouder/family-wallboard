// @flow
import React, { Component } from 'react';
import SimplePhoto from './SimplePhoto';
import DigitalClock from './DigitalClock';
import DarkSkyWeather from './DarkSkyWeather';
import './App.css';

class App extends Component {
  temperatureScale: 'c' | 'f' = 'f';

  render() {
    return (
      <div className="App">
        <SimplePhoto />
        <DigitalClock />
        <DarkSkyWeather scale={this.temperatureScale} />
      </div>
    );
  }
}

export default App;
