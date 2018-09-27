import * as DarkSkyApi from "dark-sky-api";
import * as Moment from "moment";
import * as React from "react";
import "../node_modules/weathericons/css/weather-icons.css";
import "./DarkSkyWeather.css";

interface IProps {
  apiToken: string;
  refreshTime: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface IState {
  apiData?: IWeatherData;
}

interface IWeatherData {
  currently: {
    apparentTemperature: number;
    icon: string;
    temperature: number;
    windDirection: string;
    windSpeed: number;
  };
  daily: {
    data: [
      {
        dateTime: Moment.Moment;
        precipProbability: number;
        icon: string;
        sunriseDateTime: Moment.Moment;
        sunsetDateTime: Moment.Moment;
        temperatureMax: number;
        temperatureMin: number;
      }
    ];
  };
  hourly: {
    data: [{ precipProbability: number }];
    summary: string;
  };
  precipProbability: number;
}

export default class DarkSkyWeather extends React.PureComponent<
  IProps,
  IState
> {
  public static defaultProps = {
    location: { latitude: 61.2163, longitude: -149.8949 },
    refreshTime: 3
  };

  private refreshTimer: number;

  public componentDidMount() {
    DarkSkyApi.apiKey = this.props.apiToken;

    this.refreshTimer = window.setInterval(
      this.refresh.bind(this),
      this.props.refreshTime * 60 * 1000
    );
    this.refresh();
  }

  public componentWillUnmount() {
    window.clearInterval(this.refreshTimer);
  }

  public refresh() {
    console.log("[DarkSkyWeather] Loading new weather data...");
    DarkSkyApi.loadItAll("minutely, flags", this.props.location).then(
      (result: IWeatherData) => this.setState({ apiData: result })
    );
  }

  public render() {
    console.log("[DarkSkyWeather] Rendering...");

    if (!this.state) {
      return null;
    }

    const apiData = this.state.apiData;
    if (!this.state || !apiData) {
      return null;
    }

    const forecasts = apiData.daily.data.map((data, i: number) => {
      let precipSpan: JSX.Element | null = null;
      if (data.precipProbability > 0) {
        precipSpan = (
          <span className="precip">
            {Math.round(data.precipProbability * 100)}%
          </span>
        );
      }

      return (
        <div key={i} className="forecast">
          <span className="day">
            {i === 0 ? "Today" : data.dateTime.format("ddd")}
          </span>
          <span className="high">{Math.round(data.temperatureMax)}°</span>
          <span className="low">{Math.round(data.temperatureMin)}°</span>
          <span className={"wi wi-forecast-io-" + data.icon} />
          {precipSpan}
        </div>
      );
    });

    const currentPrecipIcon =
      apiData.currently.apparentTemperature <= 32
        ? "wi-snowflake-cold"
        : "wi-raindrop";

    return (
      <div className="DarkSkyWeather">
        <div className="currentTemperature">
          {Math.round(apiData.currently.temperature)}°{" "}
          <i className={"wi wi-forecast-io-" + apiData.currently.icon} />
        </div>
        <div className="hourlySummary">{apiData.hourly.summary}</div>
        <div className="currentPrecip">
          <span className="probability">
            {Math.round(apiData.hourly.data[0].precipProbability * 100)}%
          </span>
          <span className={"wi " + currentPrecipIcon} />
        </div>
        <div className="currentWind">
          <span className="speed">
            {Math.round(apiData.currently.windSpeed)}
          </span>
          <span className="direction">{apiData.currently.windDirection}</span>
          <span className="wi wi-strong-wind" />
        </div>
        <div className="sunrise">
          {apiData.daily.data[0].sunriseDateTime.format("h:mm")}{" "}
          <i className="wi wi-sunrise" />
        </div>
        <div className="sunset">
          {apiData.daily.data[0].sunsetDateTime.format("h:mm")}{" "}
          <i className="wi wi-sunset" />
        </div>
        <div className="forecasts">{forecasts}</div>
      </div>
    );
  }
}
