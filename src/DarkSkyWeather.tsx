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
      const precip =
        data.precipProbability > 0
          ? `${Math.round(data.precipProbability * 100)}%`
          : "";

      return (
        <tr key={i} className="forecast">
          <td className="day">
            {i === 0 ? "Today" : Moment.unix(data.time).format("ddd")}
          </td>
          <td className="high">{Math.round(data.temperatureMax)}°</td>
          <td className="low">{Math.round(data.temperatureMin)}°</td>
          <td className="icon"><span className={"wi wi-forecast-io-" + data.icon} /></td>
          <td className="precip">{precip}</td>
        </tr>
      );
    });

    const currentPrecipIcon =
      apiData.currently.apparentTemperature <= 32
        ? "wi-snowflake-cold"
        : "wi-raindrop";

    return (
      <div className="DarkSkyWeather">
        <table>
          <tbody>
            <tr>
              <td className="currentTemperature">
                {Math.round(apiData.currently.temperature)}°{" "}
              </td>
              <td className="currentIcon">
                <i className={"wi wi-forecast-io-" + apiData.currently.icon} />
              </td>
            </tr>

            <tr>
              <td className="hourlySummary" colSpan={2}>
                {apiData.hourly.summary}
              </td>
            </tr>

            <tr className="precipAndWind">
              <td>
                <div className="currentPrecip">
                <span className="probability">
                  {Math.round(apiData.hourly.data[0].precipProbability * 100)}%
                </span>
                <span className={"wi " + currentPrecipIcon} />
                </div>
              </td>
              <td>
                <div className="currentWind">
                <span className="speed">
                  {Math.round(apiData.currently.windSpeed)}
                </span>
                <span className="direction">
                  {apiData.currently.windDirection}
                </span>
                <span className="wi wi-strong-wind" />
                </div>
              </td>
            </tr>

            <tr className="sunsetAndSunrise">
              <td className="sunrise">
                {Moment.unix(apiData.daily.data[0].sunriseTime).format("h:mm")}{" "}
                <i className="wi wi-sunrise" />
              </td>
              <td className="sunset">
                {Moment.unix(apiData.daily.data[0].sunsetTime).format("h:mm")}{" "}
                <i className="wi wi-sunset" />
              </td>
            </tr>

            <tr>
              <td className="forecasts" colSpan={2}>
                <table>
                  <tbody>
                    {forecasts}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
