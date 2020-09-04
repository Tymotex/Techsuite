import React from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Notification } from '../../components/notification';

class ChannelUploadCover extends React.Component {
    static propTypes = {
        match: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            channelID: props.match.params.channelID,
            modal: false,
            selectedImageFile: null
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.uploadImageFile = this.uploadImageFile.bind(this);
        this.onSelectFile = this.onSelectFile.bind(this);
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

    toggleModal() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    // API call:
    uploadImageFile(event) {
        event.preventDefault();
        const currUserToken = Cookie.get("token");
        const fd = new FormData();
        if (this.state.selectedImageFile == null) {
            Notification.spawnNotification("Failed to upload image", "No valid image file found. Please try again", "danger");
            return;
        }
        fd.append("file", this.state.selectedImageFile, "user_1_.png");
        fd.append("token", currUserToken); 
        fd.append("channel_id", this.state.channelID); 

        const postData = {
            method: "POST",
            url: `${BASE_URL}/channels/uploadcover`,
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
                console.log(err);
            })
    }

    render() {
        return (
            <>
                <Button color="info" onClick={this.toggleModal} style={{"width": "100%"}}>Upload Cover</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Uploading Channel Cover:</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.uploadImageFile}>
                            <FormGroup>
                                <Input id="fileinput" type="file" accept="image/*" onChange={this.onSelectFile} />
                                <Label id="fileinputlabel" for="fileinput">Upload image</Label>
                            </FormGroup>
                            {/* Buttons in the modal footer: */}
                            <ModalFooter>
                                <Button color="primary">Upload</Button>{' '}
                                <Button type="button" color="secondary" onClick={this.toggleModal}>Cancel</Button>
                            </ModalFooter>
                        </Form>
                    </ModalBody>
                </Modal>
            </>
        );
    }
}

export default withRouter(ChannelUploadCover);
