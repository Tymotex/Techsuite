import axios from 'axios';
import Cookie from 'js-cookie';
import React from 'react';
import { Notification } from '../notification';
import { BASE_URL } from '../../constants/api-routes';
import { errorNotification } from '../error-notification';
import ImageCropper from './ImageCropper';

class ProfileCoverForm extends React.Component {
    constructor(props) {
        super(props);
        this.uploadImageFile = this.uploadImageFile.bind(this);
        this.onSelectFile = this.onSelectFile.bind(this);
        this.state = {
            selectedImageFile: null
        };
    }

    onSelectFile(e) {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result })
            );
            reader.readAsDataURL(e.target.files[0]);

            this.setState({
                selectedImageFile: e.target.files[0]
            })
        }
    };

    // API call:
    uploadImageFile(event) {
        event.preventDefault();
        const currUserToken = Cookie.get("token");
        const currUserID = Cookie.get("user_id");
        const fd = new FormData();
        if (this.state.selectedImageFile == null) {
            Notification.spawnNotification("Failed to upload image", "No valid image file found. Please try again", "danger");
            return;
        }
        fd.append("file", this.state.selectedImageFile, "user_1_.png");
        fd.append("token", currUserToken); 
        fd.append("user_id", currUserID); 

        const postData = {
            method: "POST",
            url: `${BASE_URL}/users/profile/uploadcover`,
            data: fd,
            headers: {
                "Content-Type": "application/json"
            }
        };
        axios(postData)
            .then((res) => {
                console.log(res);
                window.location.reload();
            })
            .catch((err) => {
                errorNotification(err, "Couldn't upload cover");
            })
    }

    render() {
        return (
            <ImageCropper 
                uploadEndpoint="users/profile/uploadcover" 
                title="Update your cover image"
                buttonText="Update Cover"
                aspectRatio={16/9}
            />   
        );
    }
}

export default ProfileCoverForm;

