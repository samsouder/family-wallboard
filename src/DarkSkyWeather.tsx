import axios from "axios";
import * as Moment from "moment";
import * as React from "react";
import "../node_modules/weathericons/css/weather-icons.css";
import "./DarkSkyWeather.css";

interface IProps {
  proxyUrl: string;
  refreshTime: number;
}

interface IState {
  apiData?: IWeatherData;
}

interface IWeatherData {
  currently: {
    apparentTemperature: number;
    icon: string;
    summary: string;
    temperature: number;
    windDirection: string;
    windSpeed: number;
  };
  daily: {
    data: [
      {
        time: number;
        precipProbability: number;
        icon: string;
        sunriseTime: number;
        sunsetTime: number;
        temperatureMax: number;
        temperatureMin: number;
      }
    ];
    icon: string;
    summary: string;
  };
  hourly: {
    data: [{ precipProbability: number }];
    icon: string;
    summary: string;
  };
  precipProbability: number;
}

export default class DarkSkyWeather extends React.PureComponent<
  IProps,
  IState
> {
  public static defaultProps = {
    refreshTime: 5
  };

  private refreshTimer: number;

  public componentDidMount() {
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
    axios
      .get(this.props.proxyUrl)
      .then(result => this.setState({ apiData: result.data }))
      .catch(error =>
        console.error("[DarkSkyWeather] Failed loading weather data", error)
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
            {i === 0 ? "Today" : Moment.unix(data.time).format("ddd")}
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
          {Moment.unix(apiData.daily.data[0].sunriseTime).format("h:mm")}{" "}
          <i className="wi wi-sunrise" />
        </div>
        <div className="sunset">
          {Moment.unix(apiData.daily.data[0].sunsetTime).format("h:mm")}{" "}
          <i className="wi wi-sunset" />
        </div>
        <div className="forecasts">{forecasts}</div>
      </div>
    );
  }
}
