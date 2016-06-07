import React from 'react';
import ImageProxy from '../../valueObjects/ImageProxy';

const MAX_DISPLAY_LENGTH = 50;

export default class ImageControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentImage: new ImageProxy(props.value, null, true)
    };

    this.revokeCurrentImage = this.revokeCurrentImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFileInputRef = this.handleFileInputRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.renderImageName = this.renderImageName.bind(this);
  }

  revokeCurrentImage() {
    if (this.state.currentImage && !this.state.currentImage.uploaded) {
      this.props.onRemoveMedia(this.state.currentImage);
    }
  }

  handleFileInputRef(el) {
    this._fileInput = el;
  }

  handleClick(e) {
    this._fileInput.click();
  }

  handleDragEnter(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  handleChange(e) {
    e.stopPropagation();
    e.preventDefault();
    this.revokeCurrentImage();
    let imageRef = null;
    const fileList = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    const files = [...fileList];
    const imageType = /^image\//;

    // Iterate through the list of files and return the first image on the list
    const file = files.find((currentFile) => {
      if (imageType.test(currentFile.type)) {
        return currentFile;
      }
    });

    if (file) {
      imageRef = new ImageProxy(file.name, file);
      this.props.onAddMedia(imageRef);
    }

    this.props.onChange(imageRef);
    this.setState({currentImage: imageRef});
  }

  renderImageName() {
    if (!this.state.currentImage) return null;
    if (this.state.currentImage.uri.length < MAX_DISPLAY_LENGTH) {
      return this.state.currentImage.uri;
    }

    return this.state.currentImage.uri.substring(0, MAX_DISPLAY_LENGTH) + '\u2026';
  }

  render() {
    const imageName = this.renderImageName();
    return (
      <div
          onDragEnter={this.handleDragEnter}
          onDragOver={this.handleDragOver}
          onDrop={this.handleChange}
      >
        <span onClick={this.handleClick}>
          {imageName ? imageName : 'Click or drop imag here.'}
        </span>
        <input
            type="file"
            accept="image/*"
            onChange={this.handleChange}
            style={styles.input}
            ref={this.handleFileInputRef}
        />
      </div>
    );
  }
}

const styles = {
  input: {
    display: 'none'
  }
};
