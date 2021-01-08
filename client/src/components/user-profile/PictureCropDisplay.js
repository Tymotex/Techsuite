import React from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

class PictureCropDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div>
                    {src && (
                        <ReactCrop
                            src={src}
                            crop={crop}
                            ruleOfThirds
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                        />
                    )}
                </div>
                <div>
                    {croppedImageUrl && (
                        <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
                    )}
                </div>
            </div>
        );
    }
}

export default PictureCropDisplay;
