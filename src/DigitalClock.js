// @flow
import React, { Component } from 'react';
import Moment from 'moment';
import './DigitalClock.css';

class DigitalClock extends Component {
  timerId: number;
  displayedDate: Date;
  state: { date: Date } = { date: new Date() };

  componentDidMount() {
    this.timerId = setInterval(() => this.tick(), 5000);
    this.displayedDate = new Date();
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const diff = nextState.date.getMinutes() - this.displayedDate.getMinutes();

    // Do not re-render if it has been less than a minute
    if (diff < 1) {
      return false;
    }

    // Reset the displayed date to the newly set date
    this.displayedDate = nextState.date;

    return true;
  }

  tick() {
    this.setState({ date: new Date() });
  }

  render() {
    // console.log("[DigitalClock] Rendering...");
    const date = Moment(this.state.date);

    return (
      <div className="DigitalClock">
        <div className="time">
          <span className="hours">{date.format('h')}</span>
          <span className="minutes">{date.format('mm')}</span>
          <span className="container">
            <span className="seconds">{date.format('ss')}</span>
            <span className="ampm">{date.format('a')}</span>
          </span>
        </div>
        <div className="date">
          <span className="dayOfWeek">{date.format('dddd')}</span>
          <span className="month">{date.format('MMM')}</span>
          <span className="dayOfMonth">{date.format('Do')}</span>
        </div>
      </div>
    );
  }
}

export default DigitalClock;
