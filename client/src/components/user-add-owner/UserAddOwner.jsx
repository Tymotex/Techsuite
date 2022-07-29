import axios from 'axios';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { errorNotification } from '../error-notification';
import buttonStyles from './UserAddOwner.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HoverTooltip from '../hover-tooltip/HoverTooltip';
import { faStar } from '@fortawesome/free-solid-svg-icons';

class UserAddOwner extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      channelID: props.match.params.channelID,
      modal: false,
      isLoading: false,
      fetchSucceeded: false,
      users: [],
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.addOwner = this.addOwner.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    const currToken = Cookie.get('token');
    if (currToken) {
      axios
        .get(`${BASE_URL}/channels/details?token=${currToken}&channel_id=${this.state.channelID}`)
        .then((allUsers) => {
          this.setState({
            users: allUsers.data.all_members,
            isLoading: false,
            fetchSucceeded: true,
          });
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
            fetchSucceeded: false,
          });
          errorNotification(err, "Couldn't fetch all users");
        });
    }
  }

  toggleModal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  addOwner(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const currToken = Cookie.get('token');
    if (currToken) {
      const postData = {
        url: `${BASE_URL}/channels/addowner`,
        method: 'POST',
        data: {
          token: currToken,
          channel_id: this.state.channelID,
          user_id: formData.get('user_id'),
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      axios(postData)
        .then(() => {
          this.toggleModal();
          window.location.reload();
        })
        .catch((err) => {
          errorNotification(err, 'Failed to add owner');
        });
    }
  }

  render() {
    return (
      <>
        <button className={`${buttonStyles.button} btn-reset-style`} id="add-owner-btn" onClick={this.toggleModal}>
          <FontAwesomeIcon icon={faStar} size="lg" />
        </button>
        <HoverTooltip text={'Add a member as an owner of this channel.'} targetId="add-owner-btn" />
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            <h3>Add an owner.</h3>
          </ModalHeader>
          <Form onSubmit={this.addOwner}>
            <ModalBody>
              Select a user:
              <FormGroup>
                <Label for="exampleSelect"></Label>
                <Input type="select" name="user_id" id="exampleSelect">
                  {this.state.users.map((eachUser, i) => (
                    <option key={i} value={eachUser.user_id}>{`${eachUser.username}`}</option>
                  ))}
                </Input>
              </FormGroup>
            </ModalBody>
            {/* Buttons in the modal footer: */}
            <ModalFooter>
              <Button color="primary">Add owner</Button>{' '}
              <Button color="secondary" onClick={this.toggleModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </>
    );
  }
}

export default withRouter(UserAddOwner);
