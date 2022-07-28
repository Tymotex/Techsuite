/* eslint-disable jsx-a11y/media-has-caption, class-methods-use-this */
import React, { PureComponent } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import ImageCropper from './ImageCropper';

class ChannelPictureForm extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ImageCropper uploadEndpoint="users/profile/uploadphoto" showTitle={true}/>          
        );
    }
}

export default ChannelPictureForm;
