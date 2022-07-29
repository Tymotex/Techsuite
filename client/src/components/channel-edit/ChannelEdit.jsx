import axios from 'axios';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { errorNotification } from '../error-notification';
import { Notification } from '../notification';
import InputSwitch from './InputSwitch';
import buttonStyles from './ChannelEdit.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import HoverTooltip from '../hover-tooltip/HoverTooltip';

class ChannelEdit extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      channelID: props.match.params.channelID,
      channel: {},
      modal: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.updateChannelInfo = this.updateChannelInfo.bind(this);
  }

  UNSAFE_componentWillMount() {
    const currUserToken = Cookie.get('token');
    if (currUserToken) {
      // Now fetch the user's bio
      axios
        .get(`${BASE_URL}/channels/details?token=${currUserToken}&channel_id=${this.state.channelID}`)
        .then((channel) => {
          this.setState({
            channel: channel.data,
          });
        })
        .catch((err) => {
          errorNotification(err, 'Fetching channel details failed');
        });
    } else {
      this.setState({
        isLoading: false,
        fetchSucceeded: false,
      });
      Notification.spawnNotification('Failed', 'Please log in first', 'danger');
    }
  }

  updateChannelInfo(event) {
    event.preventDefault();
    console.log('Updating channel info');
    const fd = new FormData(event.target);

    const currUserToken = Cookie.get('token');
    console.log('Token: ' + currUserToken);
    console.log('ChannelID: ' + this.state.channelID);

    alert(fd.get('visibility') != null ? true : false);
    if (currUserToken) {
      const postData = {
        method: 'put',
        url: `${BASE_URL}/channels/update`,
        data: {
          token: currUserToken,
          channel_id: this.state.channelID,
          name: fd.get('name'),
          description: fd.get('description'),
          visibility: fd.get('visibility') != null ? true : false,
        },
        headers: { 'Content-Type': 'application/json' },
      };
      axios(postData)
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          errorNotification(err, 'Channel update failed');
        });
    }
  }

  toggleModal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  render() {
    const { name, description, visibility } = this.state.channel;
    return (
      <>
        <button className={`${buttonStyles.button} btn-reset-style`} id="channel-edit-btn" onClick={this.toggleModal}>
          <FontAwesomeIcon icon={faPen} size="lg" />
        </button>
        <HoverTooltip text={"Edit this channel's properties."} targetId="channel-edit-btn" />
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            <h3>Editing channel info.</h3>
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.updateChannelInfo}>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Channel name</InputGroupText>
                  </InputGroupAddon>
                  <Input name="name" placeholder="eg. GamerDudes" defaultValue={name} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Description</InputGroupText>
                  </InputGroupAddon>
                  <Input type="textarea" name="description" placeholder="eg. Snow" defaultValue={description} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup style={{ 'padding-left': '20px' }}>
                  <InputSwitch isActive={visibility} activeText={'Public'} inactiveText={'Private'} />
                </InputGroup>
              </FormGroup>
              <ModalFooter>
                <Button color="primary">Update</Button>{' '}
                <Button type="button" color="secondary" onClick={this.toggleModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          </ModalBody>
          {/* Buttons in the modal footer: */}
        </Modal>
      </>
    );
  }
}

export default withRouter(ChannelEdit);
