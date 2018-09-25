// @flow
/* eslint no-console: "off" */
import React, { Component } from "react";
import axios from "axios";
import exif from "exif-js";
import moment from "moment";
import Loader from "./Loader";
import "./SimpleRandomPhoto.css";

class SimpleRandomPhoto extends Component {
  state: {
    currentPhoto: string,
    nextPhoto: string
  };
  nextPhotoUrlTimer: number;

  static defaultProps = {
    photoUrl: "http://localhost:5000/",
    photoRefreshTime: 20 // seconds
  };

  constructor(props: { photoUrl: string, photoRefreshTime: number }) {
    super(props);
    this.state = {
      currentPhoto: "",
      nextPhoto: ""
    };
  }

  componentDidMount() {
    // Load first two image URLs
    let firstImage = "";
    let secondImage = "";
    axios
      .get(this.props.photoUrl)
      .then(response => {
        firstImage = this.props.photoUrl + response.data.file;
      })
      .then(() =>
        axios.get(this.props.photoUrl).then(response => {
          secondImage = this.props.photoUrl + response.data.file;

          this.setState({ currentPhoto: firstImage, nextPhoto: secondImage });
        })
      );
  }

  componentWillUnmount() {
    clearTimeout(this.nextPhotoUrlTimer);
  }

  handleNextPhotoSwitch() {
    // Load new nextPhoto
    // Set currentPhoto to nextPhoto
    // Set new nextPhoto
    axios.get(this.props.photoUrl).then(response =>
      this.setState({
        currentPhoto: this.state.nextPhoto,
        nextPhoto: this.props.photoUrl + response.data.file
      })
    );
  }

  handleMainPhotoLoaded(event) {
    // Copy loaded image into background photo holder
    let backgroundPhotoContainer = document.getElementsByClassName("PhotoBackgroundContainer")[0];
    let backgroundImage = event.target.cloneNode();
    backgroundImage.className = "PhotoBackground";
    backgroundPhotoContainer.appendChild(backgroundImage);

    console.log("Appended new background photo");

    // Update Exif data for main photo
    this.handleMainPhotoExifUpdate(event);
  }

  handleNextPhotoLoaded(event) {
    console.log(
      "Next image has loaded, waiting " + this.props.photoRefreshTime + " seconds to switch to it",
      event.target
    );
    this.nextPhotoUrlTimer = setTimeout(this.handleNextPhotoSwitch.bind(this), this.props.photoRefreshTime * 1000);
  }

  handleMainPhotoExifUpdate(event) {
    console.log("Main photo loaded", event.target);
    this.updateExifDataDisplay(event.target);
  }

  updateExifDataDisplay(imageElement: HTMLImageElement) {
    let exifElement = document.getElementsByClassName("PhotoExif")[0];
    exifElement.hidden = true;

    console.log("Finding original date time of image", imageElement);

    // Bust the exif-js cache as the image element is being re-used
    imageElement.exifdata = null;

    exif.getData(imageElement, function() {
      let originalDateTime = exif.getTag(this, "DateTimeOriginal");
      console.log("Original date time of image", originalDateTime);

      let date = moment(originalDateTime, "YYYY:MM:DD HH:mm:ss");
      if (date.isValid()) {
        exifElement.innerHTML = date.format("MMM 'YY");
        exifElement.hidden = false;
      }
    });
  }

  render() {
    console.log("Rendering...");

    const photosReady = this.state.currentPhoto && this.state.nextPhoto;

    if (!photosReady) {
      return <Loader className="PhotoLoader" />;
    }

    return (
      <div className="PhotoContainer">
        <img
          className="NextPhoto"
          src={this.state.nextPhoto}
          onLoad={this.handleNextPhotoLoaded.bind(this)}
          onError={this.handleNextPhotoLoaded.bind(this)}
          alt=""
        />
        <div className="PhotoBackgroundContainer" />
        <div className="Photo" style={{ visibility: "visible" }}>
          <img src={this.state.currentPhoto} onLoad={this.handleMainPhotoLoaded.bind(this)} alt="" />
        </div>
        <div className="PhotoExif" />
      </div>
    );
  }
}

export default SimpleRandomPhoto;
