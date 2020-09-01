import React from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ImageCropper from '../picture-form/ImageCropper';

class ChannelUploadImage extends React.Component {
    static propTypes = {
        match: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            channelID: props.match.params.channelID,
            modal: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    toggleModal() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    uploadImage(event) {
        event.preventDefault();
        const currToken = Cookie.get("token");
        if (currToken) {
            const postData = {
                url: `${BASE_URL}/channels/leave`,
                method: "POST",
                data: {
                    token: currToken,
                    channel_id: this.state.channelID
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            axios(postData)
                .then((res) => {
                    this.props.history.push("/channels/my");
                })
                .catch((err) => {
                    // TODO: replace alert
                    alert(err);
                });
        }
    }

    render() {
        return (
            <>
                <Button color="info" onClick={this.toggleModal} style={{"width": "100%"}}>Upload Image</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Uploading Channel Image:</ModalHeader>
                    <ModalBody>
                        <ImageCropper />
                    </ModalBody>
                    {/* Buttons in the modal footer: */}
                    <ModalFooter>
                        <Button color="primary" onClick={this.uploadImage}>Upload</Button>{' '}
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}

export default withRouter(ChannelUploadImage);
