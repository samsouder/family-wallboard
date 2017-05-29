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
        {/* Path is the full path in your Dropbox to the photos folder */}
        {/* PhotoUpdateTime is the time in minutes to check Dropbox for changes to your photos folder */}
        {/* PhotoRefreshTime is the time in seconds between attempts to switch to a new random photo */}
        {/* PhotoExtensions is a list of image extensions to check for when filtering the photos folder */}
        <SimplePhoto path="/Photos/Family Wallboard"
          photoUpdateTime={30}
          photoRefreshTime={20}
          photoExtensions={['jpg', 'jpeg']} />
        <DigitalClock />
        {/* Refresh time is in minutes (Note DarkSky has a 1000 requests per 24 hours limit) */}
        <DarkSkyWeather refresh={3} location={{latitude: 36.9801, longitude: -85.6122}} />
      </div>
    );
  }
}

export default App;
