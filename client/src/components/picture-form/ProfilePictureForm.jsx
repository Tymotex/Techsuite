/* eslint-disable jsx-a11y/media-has-caption, class-methods-use-this */
import React, { PureComponent } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import ImageCropper from './ImageCropper';

class ProfilePictureForm extends PureComponent {
    render() {
        return (
            <ImageCropper 
                uploadEndpoint="users/profile/uploadphoto" 
                title="Update your profile picture"
                aspectRatio={1}
            />          
        );
    }
}

export default ProfilePictureForm;
