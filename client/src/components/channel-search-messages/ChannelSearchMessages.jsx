import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import ChatBox from '../channel-messages/ChatBox';
import { errorNotification } from '../error-notification';
import HoverTooltip from '../hover-tooltip/HoverTooltip';
import { Notification } from '../notification';
import buttonStyles from './ChannelSearchMessages.module.scss';
import './ChannelSearchMessages.scss';

class ChannelSearchMessages extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      channelID: props.match.params.channelID,
      messages: [],
      modal: false,
      queryStr: '',
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.searchMessages = this.searchMessages.bind(this);
  }

  UNSAFE_componentDidMount() {
    var form = document.getElementById('dynamic-search-form');
    form.addEventListener('change', function () {
      console.log('form was changed');
    });
  }

  searchMessages() {
    console.log('Sifting through channel messages:');
    const queryStr = document.getElementById('dynamic-search-field').value;
    const currUserToken = Cookie.get('token');
    console.log('Token: ' + currUserToken);
    console.log('ChannelID: ' + this.state.channelID);
    console.log('Query:   ' + queryStr);

    if (currUserToken) {
      axios
        .get(
          `${BASE_URL}/channels/search?token=${currUserToken}&channel_id=${this.state.channelID}&query_str=${queryStr}`
        )
        .then((messagePayload) => {
          this.setState({
            queryStr: queryStr,
            messages: messagePayload.data.messages,
          });
        })
        .catch((err) => {
          errorNotification(err, 'Message search failed');
        });
    } else {
      this.setState({
        isLoading: false,
        fetchSucceeded: false,
      });
      Notification.spawnNotification('Failed', 'Please log in first', 'danger');
    }
  }

  toggleModal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  render() {
    const { messages, queryStr } = this.state;
    return (
      <>
        <button className={`${buttonStyles.button} btn-reset-style`} id="channel-search-btn" onClick={this.toggleModal}>
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </button>
        <HoverTooltip text={'Search for messages in this channel.'} targetId="channel-search-btn" />
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            <h3>Searching channel messages.</h3>
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Search for</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="dynamic-search-field"
                    name="queryString"
                    placeholder="Start typing..."
                    defaultValue={queryStr}
                    onChange={this.searchMessages}
                    autocomplete="off"
                  />
                </InputGroup>
              </FormGroup>
            </Form>
            {/* Results display: */}
            {messages && messages.length > 0 ? (
              <ChatBox messages={messages} isLoading={false} fetchSucceeded={true} />
            ) : (
              <div>No results</div>
            )}
          </ModalBody>
          {/* Buttons in the modal footer: */}
        </Modal>
      </>
    );
  }
}

export default withRouter(ChannelSearchMessages);
