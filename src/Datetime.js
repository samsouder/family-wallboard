import React, { Component } from 'react';
import Moment from 'moment'

class Datetime extends Component {
  render() {
    return <div className="Datetime">
      <div className="time">
        <span className="hours">{Moment().format('h')}</span>
        <span className="separator">:</span>
        <span className="minutes">{Moment().format('m')}</span>
        <span className="separator">:</span>
        <span className="seconds">{Moment().format('s')}</span>
        <span className="ampm">{Moment().format('a')}</span>
      </div>
      <div className="date">
        <span className="dayOfWeek">{Moment().format('ddd')}</span>
        <span className="month">{Moment().format('MMM')}</span>
        <span className="dayOfMonth">{Moment().format('Mo')}</span>
      </div>
    </div>;
  }
}

export default Datetime;
