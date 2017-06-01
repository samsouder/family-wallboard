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
        <SimplePhoto apiToken={process.env.REACT_APP_DROPBOX_API_TOKEN}
          path={process.env.REACT_APP_DROPBOX_PHOTO_PATH}
          photoUpdateTime={process.env.REACT_APP_DROPBOX_PHOTO_UPDATE_INTERVAL_IN_MINUTES}
          photoRefreshTime={process.env.REACT_APP_PHOTO_REFRESH_INTERVAL_IN_SECONDS}
          photoExtensions={process.env.REACT_APP_DROPBOX_PHOTO_EXTENSIONS.trim().split(',')} />
        <DigitalClock />
        {/* Refresh time is in minutes (Note DarkSky has a 1000 requests per 24 hours limit) */}
        <DarkSkyWeather apiToken={process.env.REACT_APP_DARKSKY_API_TOKEN}
          refreshTime={process.env.REACT_APP_WEATHER_REFRESH_INTERVAL_IN_MINUTES}
          location={{latitude: process.env.REACT_APP_DARKSKY_LOCATION_LATITUDE, longitude: process.env.REACT_APP_DARKSKY_LOCATION_LONGITUDE}} />
      </div>
    );
  }
}

export default App;
