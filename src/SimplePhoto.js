// @flow
import React, { Component } from 'react';
import './SimplePhoto.css';

// process.env.REACT_APP_DROPBOX_API_TOKEN

class SimplePhoto extends Component {
  props: { photos: string[] };

  render() {
    // Pick a random photo
    const photo: string = this.props.photos[Math.floor(Math.random() * this.props.photos.length)];

    return (
      <div>
        <div className="Photo" style={{ backgroundImage: 'url(' + photo + ')' }} />
        <div className="PhotoBackground" style={{ backgroundImage: 'url(' + photo + ')' }} />
      </div>
    );
  }
}

export default SimplePhoto;
