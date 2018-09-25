// @flow
/* eslint no-console: "off" */
import React, { PureComponent } from "react";
import axios from "axios";
import Loader from "./Loader";
import PhotoExif from "./PhotoExif.js";
import "./SimpleRandomPhoto.css";

class SimpleRandomPhoto extends PureComponent {
  state: {
    currentPhoto: string,
    nextPhoto: string
  };
  nextPhotoUrlTimer: number;
  currentPhotoRef;

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

    this.currentPhotoRef = React.createRef();
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

  handleNextPhotoLoaded(event) {
    console.log(
      "[SimpleRandomPhoto] Next image has loaded, waiting " + this.props.photoRefreshTime + " seconds to switch to it",
      event.target
    );
    this.nextPhotoUrlTimer = setTimeout(this.handleNextPhotoSwitch.bind(this), this.props.photoRefreshTime * 1000);
  }

  handleNextPhotoError(event) {
    console.log("[SimpleRandomPhoto] Next image was not loaded due to error", event);
    this.nextPhotoUrlTimer = setTimeout(this.handleNextPhotoSwitch.bind(this), this.props.photoRefreshTime * 1000);
  }

  render() {
    console.log("[SimpleRandomPhoto] Rendering...");

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
          onError={this.handleNextPhotoError.bind(this)}
          alt=""
        />
        <div className="PhotoBackgroundContainer" />
        <div className="Photo" style={{ visibility: "visible" }}>
          <img ref={this.currentPhotoRef} src={this.state.currentPhoto} alt="" />
        </div>
        <PhotoExif imageRef={this.currentPhotoRef} />
      </div>
    );
  }
}

export default SimpleRandomPhoto;
