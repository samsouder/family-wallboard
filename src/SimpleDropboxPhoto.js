// @flow
/* eslint no-console: "off" */
import React, { Component } from "react";
import Dropbox from "dropbox";
import { includes, shuffle } from "lodash";
import exif from "exif-js";
import moment from "moment";
import Loader from "./Loader";
import "./SimpleDropboxPhoto.css";

class SimpleDropboxPhoto extends Component {
  state: {
    photos: string[],
    currentPhotoUrl: string,
    nextPhotoUrl: string
  };

  dbx: Dropbox;
  currentCursor: string;
  nextPhotoUrlTimer: number;
  fetchPhotosTimer: number;
  tempImageFiles: string[];
  nextPhotoIndex: number;

  static defaultProps = {
    path: "/Photos",
    photoRefreshTime: 20, // seconds
    photoExtensions: ["jpg", "jpeg"]
  };

  constructor(props: { apiToken: string, path: string, photoRefreshTime: number, photoExtensions: string[] }) {
    super(props);
    this.state = {
      photos: [],
      currentPhotoUrl: "",
      nextPhotoUrl: ""
    };

    this.dbx = new Dropbox({ accessToken: props.apiToken });
  }

  componentDidMount() {
    // Go ahead and fire off the first update of photos from Dropbox manually
    // then start setting the first photos to display with those results
    this.recursiveFetchPhotos()
      .then(() => {
        this.initializePhotos();

        // Start polling for changes to the photos folder
        this.updatePhotos();
      })
      .catch(error => console.error(error));
  }

  componentWillUnmount() {
    clearTimeout(this.nextPhotoUrlTimer);
    clearTimeout(this.fetchPhotosTimer);
  }

  filterImages(entries: []): string[] {
    return entries
      .filter(e => {
        return e[".tag"] === "file" && includes(this.props.photoExtensions, e.name.substr(e.name.lastIndexOf(".") + 1));
      })
      .map(e => e.path_lower);
  }

  fetchPhotos(): Promise<any> {
    console.log("Fetching photos...");
    return new Promise((resolve, reject) => {
      this.dbx
        .filesListFolder({ path: this.props.path, recursive: true })
        .then(response => {
          console.log("New path cursor: " + response.cursor);
          this.currentCursor = response.cursor;

          // Filter out files with appropriate extensions and just get the path for each
          const imageFiles = this.filterImages(response.entries);

          // Merge into temporary array
          this.tempImageFiles = [...this.tempImageFiles, ...imageFiles];

          // Determine if there are more to load and keep appending
          if (response.has_more) {
            this.fetchMorePhotos()
              .then(imageFiles => {
                resolve(imageFiles);
              })
              .catch(error => console.error(error));
          } else {
            resolve(this.tempImageFiles);
          }
        })
        .catch(error => reject(error));
    });
  }

  fetchMorePhotos(): Promise<any> {
    console.log("Fetching more photos...");
    return new Promise((resolve, reject) => {
      this.dbx
        .filesListFolderContinue({ cursor: this.currentCursor })
        .then(response => {
          console.log("New path cursor: " + response.cursor);
          this.currentCursor = response.cursor;

          // Filter out files with appropriate extensions and just get the path for each
          const imageFiles = this.filterImages(response.entries);

          // Merge into temporary array
          this.tempImageFiles = [...this.tempImageFiles, ...imageFiles];

          // Determine if there are more to load and keep appending
          if (response.has_more) {
            this.fetchMorePhotos()
              .then(imageFiles => {
                resolve(imageFiles);
              })
              .catch(error => console.error(error));
          } else {
            resolve(this.tempImageFiles);
          }
        })
        .catch(error => reject(error));
    });
  }

  recursiveFetchPhotos(): Promise<any> {
    console.log("Starting photo fetch...");
    return new Promise((resolve, reject) => {
      // Clear out temporary image cache
      this.tempImageFiles = [];

      this.fetchPhotos()
        .then((imageFiles: string[]) => {
          console.log("Found " + imageFiles.length + " images");

          // Randomize the order of the photos
          const shuffledImageFiles = shuffle(imageFiles);

          // Store the photo paths in state
          this.setState({
            ...this.state,
            photos: shuffledImageFiles
          });

          // Reset which photo to load next
          this.resetNextPhotoIndex();

          // Resolve any callback
          resolve();
        })
        .catch(error => reject(error));
    });
  }

  setupNextPoll(timeToNextPoll: number) {
    console.log("Polling for new photos again in " + timeToNextPoll / 1000 + " seconds");
    this.fetchPhotosTimer = setTimeout(this.updatePhotos.bind(this), timeToNextPoll);
  }

  updatePhotos() {
    console.log("Checking Dropbox path for updates...");

    // Manually call the Longpoll API as it is broken in the Javascript SDK:
    // https://github.com/dropbox/dropbox-sdk-js/issues/85
    const headers = new Headers();
    headers.append("Content-Type", "text/plain; charset=dropbox-cors-hack");
    const body = JSON.stringify({ cursor: this.currentCursor });
    fetch("https://notify.dropboxapi.com/2/files/list_folder/longpoll", {
      method: "POST",
      headers: headers,
      mode: "cors",
      body: body
    })
      .then((response: Response) => {
        if (!response.ok) {
          throw Error("Dropbox Longpoll API request failed");
        }

        return response.json();
      })
      .then(response => {
        // Initiate another update poll in a second by default unless Dropbox asks otherwise
        let timeToNextPoll = 1000;
        if (response.backoff) {
          timeToNextPoll = ((response.backoff: any): number) * 1000;
          console.log("Dropbox asked us to backoff a bit");
        }

        if (response.changes) {
          console.log("Dropbox path was updated");
          this.recursiveFetchPhotos()
            .then(() => {
              this.setupNextPoll(timeToNextPoll);
            })
            .catch(error => console.error(error));
        } else {
          console.log("Dropbox path has not been updated yet");
          this.setupNextPoll(timeToNextPoll);
        }
      })
      .catch(error => console.error(error));
  }

  initializePhotos() {
    this.nextPhotoIndex = 1;
    this.getPhotoUrl(this.state.photos[0], () => {
      this.getPhotoUrl(this.state.photos[1]);
    });
  }

  resetNextPhotoIndex(): number {
    console.log("Resetting nextPhotoIndex to 0");
    return (this.nextPhotoIndex = 0);
  }

  incrementNextPhotoIndex(): number {
    this.nextPhotoIndex++;
    if (this.nextPhotoIndex === this.state.photos.length) {
      this.resetNextPhotoIndex();
    }
    console.log("Set nextPhotoIndex to", this.nextPhotoIndex);

    return this.nextPhotoIndex;
  }

  pickNextPhoto() {
    const path = this.state.photos[this.incrementNextPhotoIndex()];
    this.getPhotoUrl(path);
  }

  getPhotoUrl(path: string, callback?: () => void | void) {
    if (!path) {
      console.error("Photo path is empty");
      return;
    }

    // Get the temporary url for the passed photo path
    console.log("Getting url to photo: " + path);
    this.dbx
      .filesGetTemporaryLink({ path: path })
      .then(({ link }) => {
        if (!this.state.currentPhotoUrl) {
          console.log("Setting current photo to " + link);
          this.setState({
            ...this.state,
            currentPhotoUrl: link
          });
        } else if (!this.state.nextPhotoUrl) {
          console.log("Setting next photo to " + link);
          this.setState({
            ...this.state,
            nextPhotoUrl: link
          });
        } else {
          console.log("Setting current photo to " + this.state.nextPhotoUrl + " and next photo to " + link);
          this.setState({
            ...this.state,
            currentPhotoUrl: this.state.nextPhotoUrl,
            nextPhotoUrl: link
          });
        }

        if (callback) {
          callback.bind(this)();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  handleMainPhotoExifUpdate(event) {
    console.log("Main photo loaded with src", event.target);
    this.updateExifDataDisplay(event.target);
  }

  handleNextPhotoLoaded() {
    // Is this the first page load or an image that really finished loading?
    if (!this.state.nextPhotoUrl) {
      return;
    }

    console.log("Next image has loaded, waiting " + this.props.photoRefreshTime + " seconds to switch to it");
    this.nextPhotoUrlTimer = setTimeout(this.pickNextPhoto.bind(this), this.props.photoRefreshTime * 1000);
  }

  updateExifDataDisplay(imageElement: HTMLImageElement) {
    console.log("Finding original date time of image", imageElement);
    // Bust the exif-js cache as the image element is being re-used
    imageElement.exifdata = null;
    exif.getData(imageElement, function() {
      let originalDateTime = exif.getTag(this, "DateTimeOriginal");
      console.log(originalDateTime);

      let exifElement = document.getElementsByClassName("PhotoExif")[0];
      exifElement.innerHTML = moment(originalDateTime, "YYYY:MM:DD HH:mm:ss").format("MMM 'YY");
    });
  }

  render() {
    console.log("Rendering...");
    const urlsReady = this.state.currentPhotoUrl && this.state.nextPhotoUrl;

    let loader = null;
    if (!urlsReady) {
      loader = <Loader className="PhotoLoader" />;
    }

    return (
      <div className="PhotoContainer">
        <img
          className="NextPhoto"
          src={this.state.nextPhotoUrl}
          onLoad={this.handleNextPhotoLoaded.bind(this)}
          onError={this.handleNextPhotoLoaded.bind(this)}
          alt=""
        />
        <img
          className="PhotoBackground"
          src={this.state.currentPhotoUrl}
          style={{ visibility: urlsReady ? "visible" : "hidden" }}
          alt=""
        />
        <div className="Photo" style={{ visibility: urlsReady ? "visible" : "hidden" }}>
          <img src={this.state.currentPhotoUrl} onLoad={this.handleMainPhotoExifUpdate.bind(this)} alt="" />
        </div>
        <div className="PhotoExif" />
        {loader}
      </div>
    );
  }
}

export default SimpleDropboxPhoto;
