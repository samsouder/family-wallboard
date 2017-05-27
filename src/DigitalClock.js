// @flow
import React, { Component } from 'react';
import Moment from 'moment';
import './DigitalClock.css';

class DigitalClock extends Component {
  timerId: number;
  state: { date: Date } = { date: new Date() };

  componentDidMount() {
    this.timerId = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  tick() {
    this.setState({ date: new Date() });
  }

  render() {
    const date = this.state.date;

    return (
      <div className="DigitalClock">
        <div className="time">
          <span className="hours">{Moment(date).format('h')}</span>
          <span className="minutes">{Moment(date).format('mm')}</span>
          <span className="seconds">{Moment(date).format('s')}</span>
          <span className="ampm">{Moment(date).format('a')}</span>
        </div>
        <div className="date">
          <span className="dayOfWeek">{Moment(date).format('dddd')}</span>
          <span className="month">{Moment(date).format('MMM')}</span>
          <span className="dayOfMonth">{Moment(date).format('Mo')}</span>
        </div>
      </div>
    );
  }
}

export default DigitalClock;