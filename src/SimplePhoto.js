// @flow
import React, {Component} from 'react';
import Dropbox from 'dropbox';
import {includes, sample} from 'lodash'
import Loader from './Loader';
import './SimplePhoto.css';

class SimplePhoto extends Component {
  state: {
    photos: string[],
    currentPhotoUrl: string,
    nextPhotoUrl: string
  };
  dbx: Dropbox;
  timerId: number;
  photoRefreshTime: number;

  constructor(props: {}) {
    super(props);
    this.state = {
      photos: [],
      currentPhotoUrl: '',
      nextPhotoUrl: ''
    };
    this.dbx = new Dropbox({accessToken: process.env.REACT_APP_DROPBOX_API_TOKEN});
    this.photoRefreshTime = 10;
  }

  componentDidMount() {
    const extensions = ['jpg', 'jpeg'];
    this.dbx.filesListFolder({path: '/Photos/Family Wallboard', recursive: true}).then((response) => {
      const imageFiles = response.entries.filter((e) => {
        return e['.tag'] === 'file' &&
          includes(extensions, e.name.substr(e.name.lastIndexOf('.') + 1));
      }).map((e) => e.path_lower);

      // store the photo paths in state
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
      this.queuePhotoUrl(link);
    }).catch((error) => {
      console.error(error);
    }).then(() => {
      this.timerId = setTimeout(this.beamMeUpScotty.bind(this), this.photoRefreshTime * 1000);
      console.log('done getting photo url -- waiting ' + this.photoRefreshTime + ' seconds to try new photo');
    });
  }

  queuePhotoUrl(url: string) {
    if (!this.state.currentPhotoUrl) {
      this.setState({...this.state, currentPhotoUrl: url});
      return;
    }

    if (!this.state.nextPhotoUrl) {
      this.setState({...this.state, nextPhotoUrl: url});
      return;
    }

    this.setState({...this.state, currentPhotoUrl: this.state.nextPhotoUrl, nextPhotoUrl: url});
  }

  render() {
    const urlsLoaded = this.state.currentPhotoUrl && this.state.nextPhotoUrl;

    let loader = null;
    if (!urlsLoaded) {
      loader = <Loader className="PhotoLoader" />;
    }

    return (
      <div>
        {loader}
        <div className="Photo" style={{
          visibility: urlsLoaded ? 'visible' : 'hidden',
          backgroundImage: 'url(' + this.state.currentPhotoUrl + ')'
        }} />
        <div className="PhotoBackground" style={{
          visibility: urlsLoaded ? 'visible' : 'hidden',
          backgroundImage: 'url(' + this.state.currentPhotoUrl + ')'
        }} />
        <div className="NextPhoto" style={{
          backgroundImage: 'url(' + this.state.nextPhotoUrl + ')'
        }} />
      </div>
    );
  }
}

export default SimplePhoto;
