import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { UserPlus } from 'react-feather';
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { NeonButton } from '../neon-button';
import externalAuthStyle from './ExternalAuth.module.scss';
import axios from 'axios';
import { BASE_URL } from '../../constants/api-routes';
import { errorNotification } from '../error-notification';
import { withRouter } from 'react-router-dom';

class RegisterModal extends React.Component {
  static propTypes = {
    register: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
    this.signupRedirect = this.signupRedirect.bind(this);
    this.state = {
      modal: false,
    };
  }

  toggleModal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  signupRedirect() {
    axios(`${BASE_URL}/google/login`)
      .then((res) => {
        window.location.assign(res.data.google_uri);
      })
      .catch((err) => {
        errorNotification(err, 'Failed to redirect to Google auth page');
      });
  }

  render() {
    return (
      <>
        <NeonButton toggleModal={this.toggleModal} padding={'6px 15px'} isPillShaped>
          <UserPlus /> Register
        </NeonButton>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            <h3>Register an account.</h3>
          </ModalHeader>
          <br />
          <div className={externalAuthStyle.externalButton}>
            <Button color="info" onClick={this.signupRedirect}>
              <FontAwesomeIcon icon={faGoogle} />
              &ensp; Sign Up With Google
            </Button>
          </div>
          <Form onSubmit={this.props.register}>
            <ModalBody>
              {/* Username: */}
              <FormGroup>
                <Label htmlFor="username">Username</Label>
                <Input type="text" name="username" id="username" autoComplete="off" />
              </FormGroup>
              {/* Email Address: */}
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input type="email" name="email" id="email" autoComplete="off" />
              </FormGroup>
              {/* Password: */}
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input type="password" name="password" id="password" />
              </FormGroup>
              {/* Submit button: */}
            </ModalBody>
            {/* Buttons in the modal footer: */}
            <ModalFooter>
              <Button color="primary">Register</Button>{' '}
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

export default withRouter(RegisterModal);
