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
    }

    toggleModal() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        return (
            <>
                <Button color="info" onClick={this.toggleModal} style={{"width": "100%"}}>Upload Image</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Uploading Channel Image:</ModalHeader>
                    <ModalBody>
                        <ImageCropper uploadEndpoint="channels/uploadimage" title="" buttonText="Upload Image" channelID={this.state.channelID} />
                    </ModalBody>
                    {/* Buttons in the modal footer: */}
                    <ModalFooter>
                        <Button type="button" color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}

export default withRouter(ChannelUploadImage);
