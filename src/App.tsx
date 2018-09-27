import * as React from "react";
import "./App.css";
import DarkSkyWeather from "./DarkSkyWeather";
import DigitalClock from "./DigitalClock";
import RandomPhoto from "./RandomPhoto";

const photoRefreshInterval = Number(
  process.env.REACT_APP_PHOTO_REFRESH_INTERVAL_IN_SECONDS
);
const photoUrl = process.env.REACT_APP_PHOTO_URL;
const apiToken = process.env.REACT_APP_DARKSKY_API_TOKEN || "";
const weatherRefreshInterval = Number(
  process.env.REACT_APP_WEATHER_REFRESH_INTERVAL_IN_MINUTES
);
const location = {
  latitude: Number(process.env.REACT_APP_DARKSKY_LOCATION_LATITUDE),
  longitude: Number(process.env.REACT_APP_DARKSKY_LOCATION_LONGITUDE)
};
const App = () => (
  <div className="App">
    <RandomPhoto photoRefreshTime={photoRefreshInterval} photoUrl={photoUrl} />
    <DigitalClock />
    {/* Refresh time is in minutes (Note DarkSky has a 1000 requests per 24 hours limit) */}
    <DarkSkyWeather
      apiToken={apiToken}
      refreshTime={weatherRefreshInterval}
      location={location}
    />
  </div>
);

export default App;
