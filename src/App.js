// @flow
import React, { Component } from 'react';
import SimplePhoto from './SimplePhoto';
import Datetime from './Datetime';
import DarkSkyWeather from './DarkSkyWeather';
import './App.css';

class App extends Component {
  photos: string[] = [
    'https://camo.githubusercontent.com/f28b5bc7822f1b7bb28a96d8d09e7d79169248fc/687474703a2f2f692e696d6775722e636f6d2f4a65567164514d2e706e67',
    'https://d2eip9sf3oo6c2.cloudfront.net/series/covers/000/000/112/half/EGH_banner_RxJSMistakes_Final.png?1495648331',
    'http://facebook.github.io/flux/img/flux_logo.svg'
  ];
  render() {
    return (
      <div>
        <SimplePhoto photos={this.photos}/>
        <Datetime />
        <DarkSkyWeather />
      </div>
    );
  }
}

export default App;
