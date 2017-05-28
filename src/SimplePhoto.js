// @flow
/* eslint no-console: "off" */
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
  currentCursor: string;
  nextPhotoUrlTimer: number;
  fetchPhotosTimer: number;

  dbxPath: string;
  photoReloadTime: number;
  photoRefreshTime: number;
  photoExtensions: string[];

  constructor(props: {}) {
    super(props);
    this.state = {
      photos: [],
      currentPhotoUrl: '',
      nextPhotoUrl: ''
    };

    this.dbx = new Dropbox({accessToken: process.env.REACT_APP_DROPBOX_API_TOKEN});
    this.dbxPath = '/Photos/Family Wallboard';
    this.photoReloadTime = 30; // minutes
    this.photoRefreshTime = 20; // seconds
    this.photoExtensions = ['jpg', 'jpeg'];
  }

  componentDidMount() {
    setInterval(this.updatePhotos.bind(this), this.photoRefreshTime * 60 * 1000);
    this.fetchPhotos();
  }

  componentWillUnmount() {
    clearTimeout(this.nextPhotoUrlTimer);
    clearInterval(this.fetchPhotosTimer);
  }

  fetchPhotos() {
    console.log('Fetching photos...');
    this.dbx.filesListFolder({path: this.dbxPath, recursive: true}).then((response) => {
      console.log('New path cursor: ' + response.cursor);
      this.currentCursor = response.cursor;

      // Filter out files with appropriate extensions and just get the path for each
      const imageFiles = response.entries.filter((e) => {
        return e['.tag'] === 'file' &&
          includes(this.photoExtensions, e.name.substr(e.name.lastIndexOf('.') + 1));
      }).map((e) => e.path_lower);
      console.log('Found ' + imageFiles.length + ' images');

      // Store the photo paths in state
      this.setState({...this.state, photos: imageFiles});

      // Start the process of picking a photo and getting its url
      this.beamMeUpScotty();
    }).catch((error) => {
      console.error(error);
    });
  }

  updatePhotos () {
    console.log('Checking Dropbox path for updates...');
    this.dbx.filesListFolderGetLatestCursor({path: this.dbxPath, recursive: true}).then((response) => {
      if (response.cursor !== this.currentCursor) {
        console.log('Dropbox path was updated to new cursor: ' + response.cursor);
        this.fetchPhotos();
      }
      console.log('Dropbox path has not been updated yet');
    }).catch((error) => {
      console.error(error);
    });
  }

  beamMeUpScotty() {
    // Get a random photo and get then set it's url
    const path = sample(this.state.photos)
    this.getPhotoUrl(path);
  }

  getPhotoUrl(path: string) {
    if (!path) {
      console.error('Photo path is empty');
      return;
    }

    // Get the temporary url for the passed photo path
    console.log('Getting url to photo: ' + path);
    this.dbx.filesGetTemporaryLink({path: path}).then(({link}) => {
      this.queuePhotoUrl(link);
    }).catch((error) => {
      console.error(error);
    }).then(() => {
      this.nextPhotoUrlTimer = setTimeout(this.beamMeUpScotty.bind(this), this.photoRefreshTime * 1000);
      console.log('Waiting ' + this.photoRefreshTime + ' seconds to try next photo');
    });
  }

  queuePhotoUrl(url: string) {
    if (!this.state.currentPhotoUrl) {
      console.log('Setting current photo to ' + url)
      this.setState({...this.state, currentPhotoUrl: url});
      return;
    }

    if (!this.state.nextPhotoUrl) {
      console.log('Setting next photo to ' + url)
      this.setState({...this.state, nextPhotoUrl: url});
      return;
    }

    console.log('Setting current photo to ' + this.state.nextPhotoUrl + ' and next photo to ' + url);
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
