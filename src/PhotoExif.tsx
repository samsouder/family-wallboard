import * as exif from "exif-js";
import * as moment from "moment";
import * as React from "react";

interface IEXIFImageElement extends HTMLImageElement {
  exifdata?: any;
}

export default class PhotoExif extends React.PureComponent<
  { imageRef: React.RefObject<IEXIFImageElement> },
  { date?: string }
> {
  public componentDidMount() {
    this.props.imageRef.current!.onload = () =>
      this.updateExifDataDisplay(this.props.imageRef.current);
  }

  public updateExifDataDisplay(imageElement: IEXIFImageElement | null) {
    if (!imageElement) {
      return;
    }

    console.log(
      "[PhotoExif]",
      "Finding original date time of image",
      imageElement.src
    );

    // Bust the exif-js cache as the image element is being re-used
    imageElement.exifdata = null;

    const that = this;
    exif.getData(imageElement as any, function(this: HTMLImageElement) {
      const originalDateTime = exif.getTag(this, "DateTimeOriginal");
      console.log(
        "[PhotoExif]",
        "Original date time of image",
        originalDateTime
      );

      const date = moment(originalDateTime, "YYYY:MM:DD HH:mm:ss");
      if (!date.isValid()) {
        console.log("[PhotoExif] ** Invalid date found **", originalDateTime);
      }

      that.setState({ date: date.format("MMM 'YY") });
    });
  }

  public render() {
    console.log("[PhotoExif]", "Rendering...");

    if (!this.state) {
      return null;
    }

    if (!this.state.date) {
      return null;
    }

    return <div className="PhotoExif">{this.state.date}</div>;
  }
}
