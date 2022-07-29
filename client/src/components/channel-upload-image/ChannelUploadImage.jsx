import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import HoverTooltip from '../hover-tooltip/HoverTooltip';
import ImageCropper from '../picture-form/ImageCropper';
import buttonStyles from './ChannelUploadImage.module.scss';

class ChannelUploadImage extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      channelID: props.match.params.channelID,
      modal: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  render() {
    return (
      <>
        <button
          className={`${buttonStyles.button} btn-reset-style`}
          id="channel-image-upload-btn"
          onClick={this.toggleModal}
        >
          <FontAwesomeIcon icon={faImage} size="lg" />
        </button>
        <HoverTooltip text={'Upload a new image for this channel.'} targetId="channel-image-upload-btn" />
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            <h3>Uploading channel image.</h3>
          </ModalHeader>
          <ModalBody>
            <ImageCropper
              uploadEndpoint="channels/uploadimage"
              title=""
              buttonText="Upload Image"
              channelID={this.state.channelID}
              aspectRatio={1}
            />
          </ModalBody>
        </Modal>
      </>
    );
  }
}

export default withRouter(ChannelUploadImage);
