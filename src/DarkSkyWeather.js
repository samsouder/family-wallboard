// @flow
import React, { Component } from 'react';
import DarkSkyApi from 'dark-sky-api';
import './DarkSkyWeather.css';
import '../node_modules/weathericons/css/weather-icons.css';

class DarkSkyWeather extends Component {
  state: {
    apiData?: {}
  };
  refreshTimer: number;

  static defaultProps = {
    refreshTime: 3,
    location: {latitude: 61.2163, longitude: -149.8949}
  }

  constructor(props: {refreshTime: number, location: {latitude: number, longitude: number}}) {
    super(props);
    this.state = {};

    DarkSkyApi.apiKey = process.env.REACT_APP_DARKSKY_API_TOKEN;
  }

  componentDidMount() {
    setInterval(this.refresh.bind(this), this.props.refreshTime * 60 * 1000);
    this.refresh();
  }

  refresh() {
    DarkSkyApi.loadItAll('minutely, flags', this.props.location).then(result => this.setState({apiData: result}));
  }

  render() {
    if (this.state.apiData === undefined) {
      return null;
    }

    const forecasts = this.state.apiData.daily.data.map((data, i) => {
      return (
        <div key={i} className="forecast">
          <span className="day">{(i === 0 ) ? 'Today' : data.dateTime.format('ddd')}</span>
          <span className="high">{Math.round(data.temperatureMax)}°</span>
          <span className="low">{Math.round(data.temperatureMin)}°</span>
          <span className={'wi wi-forecast-io-' + data.icon} />
        </div>
      );
    });

    return (
      <div className="DarkSkyWeather">
        <div className="currentTemperature">{Math.round(this.state.apiData.currently.temperature)}° <i className={'wi wi-forecast-io-' + this.state.apiData.currently.icon} /></div>
        <div className="hourlySummary">{this.state.apiData.hourly.summary}</div>
        <div className="currentWind">
          <span className="speed">{Math.round(this.state.apiData.currently.windSpeed)}</span>
          <span className="direction">{this.state.apiData.currently.windDirection}</span>
          <span className="wi wi-strong-wind" />
        </div>
        <div className="sunrise">{this.state.apiData.daily.data[0].sunriseDateTime.format('h:mm')} <i className="wi wi-sunrise" /></div>
        <div className="sunset">{this.state.apiData.daily.data[0].sunsetDateTime.format('h:mm')} <i className="wi wi-sunset" /></div>
        <div className="forecasts">
          <div className="summary">{this.state.apiData.daily.summary}</div>
          {forecasts}
        </div>
      </div>
    );
  }
}

export default DarkSkyWeather;
