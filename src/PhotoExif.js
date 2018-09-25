// @flow
/* eslint no-console: "off" */
import React, { PureComponent } from "react";
import exif from "exif-js";
import moment from "moment";

class PhotoExif extends PureComponent {
  state: {
    date: string
  } = { date: null };

  componentDidMount() {
    this.props.imageRef.current.onload = () => this.updateExifDataDisplay(this.props.imageRef.current);
  }

  updateExifDataDisplay(imageElement: HTMLImageElement) {
    console.log("[PhotoExif]", "Finding original date time of image", imageElement.src);

    // Bust the exif-js cache as the image element is being re-used
    imageElement.exifdata = null;

    const that = this;
    exif.getData(imageElement, function() {
      const originalDateTime = exif.getTag(this, "DateTimeOriginal");
      console.log("[PhotoExif]", "Original date time of image", originalDateTime);

      const date = moment(originalDateTime, "YYYY:MM:DD HH:mm:ss");
      if (!date.isValid()) {
        console.log("[PhotoExif] ** Invalid date found **", originalDateTime);
      }

      that.setState({ date: date.format("MMM 'YY") });
    });
  }

  render() {
    console.log("[PhotoExif]", "Rendering...");

    if (!this.state.date) {
      return null;
    }

    return <div className="PhotoExif">{this.state.date}</div>;
  }
}

export default PhotoExif;
