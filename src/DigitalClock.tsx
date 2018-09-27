import * as Moment from "moment";
import * as React from "react";
import "./DigitalClock.css";

class DigitalClock extends React.PureComponent<{}, { date: Moment.Moment }> {
  public state = { date: Moment() };
  private timerId: number;

  public componentDidMount() {
    this.timerId = window.setInterval(() => this.tick(), 10000);
  }

  public componentWillUnmount() {
    window.clearInterval(this.timerId);
  }

  public tick() {
    const newTime = Moment();
    if (newTime.minutes() !== this.state.date.minutes()) {
      this.setState({ date: newTime });
    }
  }

  public render() {
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
