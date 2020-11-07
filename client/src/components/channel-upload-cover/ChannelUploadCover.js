import React from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Notification } from '../../components/notification';
import ImageCropper from '../../components/picture-form/ImageCropper';

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
    }

    toggleModal() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        return (
            <>
                <Button color="info" onClick={this.toggleModal} style={{"width": "100%"}}>Upload Cover</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Uploading Channel Cover:</ModalHeader>
                    <ModalBody>
                        <ImageCropper 
                            uploadEndpoint="channels/uploadcover" 
                            title="" 
                            buttonText="Upload Cover" 
                            channelID={this.state.channelID} 
                            aspectRatio={16/9}
                        />
                    </ModalBody>
                </Modal>
            </>
        );
    }
}

export default withRouter(ChannelUploadCover);
