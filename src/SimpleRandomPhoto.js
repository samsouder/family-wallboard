// @flow
/* eslint no-console: "off" */
import React, { Component } from "react";
import exif from "exif-js";
import moment from "moment";
import "./SimpleRandomPhoto.css";

class SimpleRandomPhoto extends Component {
  state: {
    nextPhotoIndex: number
  };
  nextPhotoUrlTimer: number;

  static defaultProps = {
    photoUrl: "http://localhost:5000/",
    photoRefreshTime: 20 // seconds
  };

  constructor(props: { photoUrl: string, photoRefreshTime: number }) {
    super(props);
    this.state = {
      nextPhotoIndex: 0
    };
  }

  componentWillUnmount() {
    clearTimeout(this.nextPhotoUrlTimer);
  }

  incrementPhotoIndex() {
    const newIndex = this.state.nextPhotoIndex + 1;
    console.log("Incrementing nextPhotoIndex to:", newIndex);
    this.setState({ nextPhotoIndex: newIndex });
  }

  handleMainPhotoExifUpdate(event) {
    console.log("Main photo loaded", event.target);
    this.updateExifDataDisplay(event.target);
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
    this.nextPhotoUrlTimer = setTimeout(this.incrementPhotoIndex.bind(this), this.props.photoRefreshTime * 1000);
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

    return (
      <div className="PhotoContainer">
        <img
          className="NextPhoto"
          src={this.props.photoUrl + this.state.nextPhotoIndex}
          onLoad={this.handleNextPhotoLoaded.bind(this)}
          onError={this.handleNextPhotoLoaded.bind(this)}
          style={{ visibility: "hidden" }}
          alt=""
        />
        <div className="PhotoBackgroundContainer" />
        <div className="Photo">
          <img
            src={this.props.photoUrl + (this.state.nextPhotoIndex - 1)}
            onLoad={this.handleMainPhotoLoaded.bind(this)}
            alt=""
          />
        </div>
        <div className="PhotoExif" />
      </div>
    );
  }
}

export default SimpleRandomPhoto;
