import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { errorNotification } from '../error-notification';
import buttonStyles from './ChannelLeave.module.scss';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import HoverTooltip from '../hover-tooltip/HoverTooltip';

class ChannelLeave extends React.Component {
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
    this.leaveChannel = this.leaveChannel.bind(this);
  }

  toggleModal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  leaveChannel(event) {
    event.preventDefault();
    const currToken = Cookie.get('token');
    if (currToken) {
      const postData = {
        url: `${BASE_URL}/channels/leave`,
        method: 'POST',
        data: {
          token: currToken,
          channel_id: this.state.channelID,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      axios(postData)
        .then((res) => {
          this.props.history.push('/channels/my');
        })
        .catch((err) => {
          errorNotification(err, 'Channel leave failed');
        });
    }
  }

  render() {
    return (
      <>
        <button className={`${buttonStyles.button} btn-reset-style`} id="leave-channel-btn" onClick={this.toggleModal}>
          <FontAwesomeIcon icon={faDoorOpen} size="lg" />
        </button>
        <HoverTooltip text={'Leave this channel ;('} targetId="leave-channel-btn" />
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            <h3>Leaving channel.</h3>
          </ModalHeader>
          <ModalBody>Are you sure you want to leave this channel?</ModalBody>
          {/* Buttons in the modal footer: */}
          <ModalFooter>
            <Button color="danger" onClick={this.leaveChannel}>
              Leave
            </Button>{' '}
            <Button color="secondary" onClick={this.toggleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default withRouter(ChannelLeave);
