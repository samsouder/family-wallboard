import * as React from "react";
import "./App.css";
import DarkSkyWeather from "./DarkSkyWeather";
import DigitalClock from "./DigitalClock";
import RandomPhoto from "./RandomPhoto";

const photoRefreshInterval = Number(
  process.env.REACT_APP_PHOTO_REFRESH_INTERVAL_IN_SECONDS
);
const photoUrl = process.env.REACT_APP_PHOTO_URL || "";
const weatherProxyUrl = process.env.REACT_APP_DARKSKY_PROXY_URL || "";
const weatherRefreshInterval = Number(
  process.env.REACT_APP_WEATHER_REFRESH_INTERVAL_IN_MINUTES
);

const App = () => (
  <div className="App">
    <RandomPhoto photoRefreshTime={photoRefreshInterval} photoUrl={photoUrl} />
    <DigitalClock />
    {/* Refresh time is in minutes (Note DarkSky has a 1000 requests per 24 hours limit) */}
    <DarkSkyWeather
      proxyUrl={weatherProxyUrl}
      refreshTime={weatherRefreshInterval}
    />
  </div>
);

export default App;
