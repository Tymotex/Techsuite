import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Notification } from '../notification';
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
                    <Notification />
                    <ModalHeader toggle={this.toggleModal}>Uploading Channel Image:</ModalHeader>
                    <ModalBody>
                        <ImageCropper uploadEndpoint="channels/uploadimage" title="" buttonText="Upload Image" channelID={this.state.channelID} />
                    </ModalBody>
                </Modal>
            </>
        );
    }
}

export default withRouter(ChannelUploadImage);
