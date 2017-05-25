import React, { Component } from 'react';
import SimplePhoto from './SimplePhoto';
import Datetime from './Datetime';
import DarkSkyWeather from './DarkSkyWeather';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <SimplePhoto />
        <Datetime />
        <DarkSkyWeather />
      </div>
    );
  }
}

export default App;
