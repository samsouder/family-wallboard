// @flow
import React, { PureComponent } from "react";
import Moment from "moment";
import "./DigitalClock.css";

class DigitalClock extends PureComponent {
  timerId: number;
  state: { date: string } = { date: new Moment() };

  componentDidMount() {
    this.timerId = setInterval(() => this.tick(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  tick() {
    const newTime = Moment();
    if (newTime.minutes() !== this.state.date.minutes()) {
      this.setState({ date: newTime });
    }
  }

  render() {
    console.log("[DigitalClock] Rendering...");

    return (
      <div className="DigitalClock">
        <div className="time">
          <span className="hours">{this.state.date.format("h")}</span>
          <span className="minutes">{this.state.date.format("mm")}</span>
          <span className="container">
            <span className="seconds">{this.state.date.format("ss")}</span>
            <span className="ampm">{this.state.date.format("a")}</span>
          </span>
        </div>
        <div className="date">
          <span className="dayOfWeek">{this.state.date.format("dddd")}</span>
          <span className="month">{this.state.date.format("MMM")}</span>
          <span className="dayOfMonth">{this.state.date.format("Do")}</span>
        </div>
      </div>
    );
  }
}

export default DigitalClock;
