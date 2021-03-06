// @flow
import React, { Component } from 'react';
import SimpleDropboxPhoto from './SimpleDropboxPhoto';
import DigitalClock from './DigitalClock';
import DarkSkyWeather from './DarkSkyWeather';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* Path is the full path in your Dropbox to the photos folder */}
        {/* PhotoRefreshTime is the time in seconds between attempts to switch to a new random photo */}
        {/* PhotoExtensions is a list of image extensions to check for when filtering the photos folder */}
        <SimpleDropboxPhoto apiToken={((process.env.REACT_APP_DROPBOX_API_TOKEN: any): string)}
          path={((process.env.REACT_APP_DROPBOX_PHOTO_PATH: any): string)}
          photoRefreshTime={((process.env.REACT_APP_PHOTO_REFRESH_INTERVAL_IN_SECONDS: any): number)}
          photoExtensions={((process.env.REACT_APP_DROPBOX_PHOTO_EXTENSIONS: any): string).trim().split(',')} />
        <DigitalClock />
        {/* Refresh time is in minutes (Note DarkSky has a 1000 requests per 24 hours limit) */}
        <DarkSkyWeather apiToken={((process.env.REACT_APP_DARKSKY_API_TOKEN: any): string)}
          refreshTime={((process.env.REACT_APP_WEATHER_REFRESH_INTERVAL_IN_MINUTES: any): number)}
          location={{
            latitude: ((process.env.REACT_APP_DARKSKY_LOCATION_LATITUDE: any): number),
            longitude: ((process.env.REACT_APP_DARKSKY_LOCATION_LONGITUDE: any): number)
          }} />
      </div>
    );
  }
}

export default App;
