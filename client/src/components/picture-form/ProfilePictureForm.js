/* eslint-disable jsx-a11y/media-has-caption, class-methods-use-this */
import React, { PureComponent } from 'react';
import Cookie from 'js-cookie';
import { Form, FormGroup, FormText, Input, Label, Button, Row, Col } from 'reactstrap';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';
import { BASE_URL } from '../../constants/api-routes';
import NeonButton from '../neon-button/NeonButton';
import ImageCropper from './ImageCropper';

class ProfilePictureForm extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ImageCropper uploadEndpoint="users/profile/uploadphoto"/>          
        );
    }
}

export default ProfilePictureForm;
