import Cookie from 'js-cookie';
import React from 'react';
import {
  Button,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import io from 'socket.io-client';
import { SOCKET_URI } from '../../constants/api-routes';
import './EditButton.scss';

const socket = io(SOCKET_URI);

class EditButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  toggleModal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  updateMessage(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const { room } = this.props;
    const newMessage = fd.get('edited-message');
    const currToken = Cookie.get('token');
    if (currToken) {
      console.log(`Emitting edit_message with params: ${currToken} ${this.props.messageID}`);
      socket.emit('edit_message', currToken, this.props.messageID, newMessage, room);
    }
  }

  deleteMessage() {
    const currToken = Cookie.get('token');
    const { room } = this.props;
    if (currToken) {
      console.log(`Emitting remove_message with params: ${currToken} ${this.props.messageID}`);
      socket.emit('remove_message', currToken, this.props.messageID, room);
    }
  }

  render() {
    const { message } = this.props;
    return (
      <>
        <span className="message-popup" onClick={this.toggleModal} />
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            <h3>Editing message</h3>
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.updateMessage}>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Edit</InputGroupText>
                </InputGroupAddon>
                <Input
                  name="edited-message"
                  type="textarea"
                  placeholder="Edit your message here"
                  style={{ 'min-height': '50px' }}
                  defaultValue={message}
                />
              </InputGroup>
              <ModalFooter>
                <Button color="primary">Update</Button>
                <Button color="danger" onClick={this.deleteMessage}>
                  Delete
                </Button>
                <Button color="secondary" onClick={this.toggleModal} type="button">
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

export default EditButton;
