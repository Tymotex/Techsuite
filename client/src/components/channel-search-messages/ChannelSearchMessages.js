import React from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Button, Label } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Notification } from '../notification';
import ChatBox from '../channel-messages/ChatBox';
import './ChannelSearchMessages.scss';

class ChannelSearchMessages extends React.Component {
    static propTypes = {
        match: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            channelID: props.match.params.channelID,
            messages: [],
            modal: false,
            queryStr: ""
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.searchMessages = this.searchMessages.bind(this);
    }

    UNSAFE_componentDidMount() {
        var form = document.getElementById("dynamic-search-form");
        form.addEventListener("change", function() {
            console.log('form was changed');
        });
    }

    searchMessages() {
        console.log("Sifting through channel messages:");
        const queryStr = document.getElementById("dynamic-search-field").value;
        const currUserToken = Cookie.get("token");
        console.log("Token: " + currUserToken);
        console.log("ChannelID: " + this.state.channelID);
        console.log("Query:   " + queryStr);

        if (currUserToken) {
            axios.get(`${BASE_URL}/channels/search?token=${currUserToken}&channel_id=${this.state.channelID}&query_str=${queryStr}`)
                .then((messagePayload) => {
                    this.setState({
                        queryStr: queryStr,
                        messages: messagePayload.data.messages
                    });
                })
                .catch((err) => {
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Message search failed", errorMessage, "danger");
                });
        } else {
            this.setState({
                isLoading: false,
                fetchSucceeded: false
            });
            Notification.spawnNotification("Failed", "Please log in first", "danger");
        }
    }

    toggleModal() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        const { messages, queryStr } = this.state;
        return (
            <>
                <Button color="secondary" onClick={this.toggleModal} style={{"width": "100%"}}>Search Messages</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <Notification />
                    <ModalHeader toggle={this.toggleModal}>Searching Channel Messages:</ModalHeader>
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
                                        autocomplete="off" />
                                </InputGroup>
                            </FormGroup>
                        </Form>
                        {/* Results display: */}
                        {(messages && messages.length > 0) ? (
                            <ChatBox messages={messages} isLoading={false} fetchSucceeded={true}/>
                        ) : (
                            <div>
                                No results
                            </div>
                        )}

                    </ModalBody>
                    {/* Buttons in the modal footer: */}
                </Modal>
            </>
        );
    }
}

export default withRouter(ChannelSearchMessages);
