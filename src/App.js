// @flow
import React, { PureComponent } from "react";
import SimpleRandomPhoto from "./SimpleRandomPhoto";
import DigitalClock from "./DigitalClock";
import DarkSkyWeather from "./DarkSkyWeather";
import "./App.css";

const App = () => (
  <div className="App">
    <SimpleRandomPhoto
      photoRefreshTime={((process.env.REACT_APP_PHOTO_REFRESH_INTERVAL_IN_SECONDS: any): number)}
      photoUrl={((process.env.REACT_APP_PHOTO_URL: any): string)}
    />
    <DigitalClock />
    {/* Refresh time is in minutes (Note DarkSky has a 1000 requests per 24 hours limit) */}
    <DarkSkyWeather
      apiToken={((process.env.REACT_APP_DARKSKY_API_TOKEN: any): string)}
      refreshTime={((process.env.REACT_APP_WEATHER_REFRESH_INTERVAL_IN_MINUTES: any): number)}
      location={{
        latitude: ((process.env.REACT_APP_DARKSKY_LOCATION_LATITUDE: any): number),
        longitude: ((process.env.REACT_APP_DARKSKY_LOCATION_LONGITUDE: any): number)
      }}
    />
  </div>
);

export default App;
