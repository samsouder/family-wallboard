// @flow
import React, {Component} from 'react';
import Dropbox from 'dropbox';
import {includes, sample} from 'lodash'
import './SimplePhoto.css';

class SimplePhoto extends Component {
  state: {
    photos: string[],
    url: string
  };
  dbx: Dropbox;
  timerId: number;
  photoRefreshTime: number;

  constructor(props: {}) {
    super(props);
    this.state = {
      photos: [],
      url: ''
    };
    this.dbx = new Dropbox({accessToken: process.env.REACT_APP_DROPBOX_API_TOKEN});
    this.photoRefreshTime = 10;
  }

  componentDidMount() {
    console.log('componentDidMount');
    const extensions = ['jpg', 'jpeg'];
    this.dbx.filesListFolder({path: '/Photos/Family Wallboard', recursive: true}).then((response) => {
      const imageFiles = response.entries.filter((e) => {
        return e['.tag'] === 'file' &&
          includes(extensions, e.name.substr(e.name.lastIndexOf('.') + 1));
      }).map((e) => e.path_lower);

      // store the photo paths in state
      console.log('finished getting photos');
      this.setState({...this.state, photos: imageFiles});

      // start the process of picking a photo and getting its url
      this.beamMeUpScotty();
    }).catch((error) => {
      console.error(error);
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
  }

  beamMeUpScotty() {
    if (this.state.photos.length === 0) {
      this.timerId = setTimeout(this.beamMeUpScotty.bind(this), this.photoRefreshTime * 1000);
      return;
    }
    // get random photo
    const path = sample(this.state.photos)
    this.getPhotoUrl(path);
  }

  getPhotoUrl(path: string) {
    this.dbx.filesGetTemporaryLink({path: path}).then(({link}) => {
      this.setState({...this.state, url: link});
    }).catch((error) => {
      console.error(error);
    }).then(() => {
      this.timerId = setTimeout(this.beamMeUpScotty.bind(this), this.photoRefreshTime * 1000);
      console.log('done getting photo url -- waiting ' + this.photoRefreshTime + ' seconds to try new photo');
    });
  }

  render() {
    if (!this.state.url) {
      return <div>{'Loading photos...'}</div>;
    }

    return (
      <div>
        <div className="Photo" style={{
          backgroundImage: 'url(' + this.state.url + ')'
        }}/>
        <div className="PhotoBackground" style={{
          backgroundImage: 'url(' + this.state.url + ')'
        }}/>
      </div>
    );
  }
}

export default SimplePhoto;
