import axios from "axios";
import * as React from "react";
import Loader from "./Loader";
import PhotoExif from "./PhotoExif";
import "./RandomPhoto.css";

interface IProps {
  photoUrl: string;
  photoRefreshTime: number;
}

interface IState {
  currentPhoto: string;
  nextPhoto: string;
}

export default class SimpleRandomPhoto extends React.PureComponent<
  IProps,
  IState
> {
  public static defaultProps = {
    photoRefreshTime: 20, // seconds
    photoUrl: "http://localhost:5000/"
  };
  private nextPhotoUrlTimer: number;
  private currentPhotoRef: React.RefObject<HTMLImageElement>;

  constructor(props: IProps) {
    super(props);
    this.state = {
      currentPhoto: "",
      nextPhoto: ""
    };

    this.currentPhotoRef = React.createRef();

    this.handleNextPhotoLoaded = this.handleNextPhotoLoaded.bind(this);
    this.handleNextPhotoError = this.handleNextPhotoError.bind(this);
    this.handleNextPhotoSwitch = this.handleNextPhotoSwitch.bind(this);
  }

  public componentDidMount() {
    this.loadFirstImageUrls();
  }

  public componentWillUnmount() {
    window.clearTimeout(this.nextPhotoUrlTimer);
  }

  public async loadFirstImageUrls() {
    // return this.props.photoUrl + response.data.file;
    await Promise.all([
      axios
        .get(this.props.photoUrl)
        .then(result => this.props.photoUrl + result.data.file),
      axios
        .get(this.props.photoUrl)
        .then(result => this.props.photoUrl + result.data.file)
    ])
      .then(([firstImage, secondImage]) => {
        console.log(
          "[RandomPhoto] Loaded first two image URLs",
          firstImage,
          secondImage
        );
        this.setState({ currentPhoto: firstImage, nextPhoto: secondImage });
      })
      .catch(error =>
        console.error(
          "[RandomPhoto] Failed loading first two image URLs",
          error
        )
      );
  }

  public handleNextPhotoSwitch() {
    // Load new nextPhoto
    // Set currentPhoto to nextPhoto
    // Set new nextPhoto
    axios.get(this.props.photoUrl).then(response => {
      console.log(
        "[RandomPhoto] Fetched new image to load next",
        response.data.file
      );
      this.setState({
        currentPhoto: this.state.nextPhoto,
        nextPhoto: this.props.photoUrl + response.data.file
      });
    });
  }

  public handleNextPhotoLoaded(event: React.SyntheticEvent<HTMLImageElement>) {
    console.log(
      "[SimpleRandomPhoto] Next image has loaded, waiting " +
        this.props.photoRefreshTime +
        " seconds to switch to it",
      event.target
    );
    this.nextPhotoUrlTimer = window.setTimeout(
      this.handleNextPhotoSwitch,
      this.props.photoRefreshTime * 1000
    );
  }

  public handleNextPhotoError(event: React.SyntheticEvent<HTMLImageElement>) {
    console.log(
      "[SimpleRandomPhoto] Next image was not loaded due to error",
      event
    );
    this.nextPhotoUrlTimer = window.setTimeout(
      this.handleNextPhotoSwitch,
      this.props.photoRefreshTime * 1000
    );
  }

  public render() {
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
          onLoad={this.handleNextPhotoLoaded}
          onError={this.handleNextPhotoError}
          alt=""
        />
        <div className="PhotoBackgroundContainer" />
        <div className="Photo" style={{ visibility: "visible" }}>
          <img
            ref={this.currentPhotoRef}
            src={this.state.currentPhoto}
            alt=""
          />
        </div>
        <PhotoExif imageRef={this.currentPhotoRef} />
      </div>
    );
  }
}
