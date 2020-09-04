import React from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import './ChannelMessages.scss';
import { Form, FormGroup, Button, Input, Row, Col, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import Message from './Message';
import { BASE_URL } from '../../constants/api-routes';
import { LoadingSpinner } from '../loading-spinner';
import EmptyChatIndicator from './EmptyChatIndicator';
import FadeIn from 'react-fade-in';

import openSocket from 'socket.io-client';
import TypingPrompt from './TypingPrompt';


const socket = openSocket('http://localhost:3001');

class ChannelMessages extends React.Component {
    constructor(props) {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            messages: [],
            isSomeoneElseTyping: false
        };
        // Binding socket listener handlers:
        socket.on("receive_message", (message) => {
            console.log(`Received realtime message: ${message}`);
            this.fetchMessages();
        });
        socket.on("show_typing_prompt", () => {
            console.log("User is typing...");
            this.setState({
                isSomeoneElseTyping: true
            });
        });
        socket.on("hide_typing_prompt", () => {
            console.log("User is NOT typing...");
            this.setState({
                isSomeoneElseTyping: false
            });
        });
        this.broadcastTypingPrompt = this.broadcastTypingPrompt.bind(this);
    }

    componentWillMount() {
        this.fetchMessages();
    }

    componentDidMount() {
        const textField = document.getElementById("typingArea");
        if (textField) {
            textField.addEventListener("input", this.broadcastTypingPrompt);
        } else {
            console.log("Typing text field could not be selected!");
        }
    }

    broadcastTypingPrompt(event) {
        // Extracting the current value in the text field from the event object
        // and checking whether it is non-empty (contains non-whitespace characters)
        const currMessage = event.target.value;
        if (currMessage.trim() !== "") {
            socket.emit("started_typing");
        } else {
            socket.emit("stopped_typing");
        }
    }

    sendMessage(event) {
        event.preventDefault();
        const messageData = new FormData(event.target);
        const currToken = Cookie.get("token");
        if (currToken) {
            console.log(`Sending the message: ${messageData.get("message")}`);
            console.log(`Emitting send_message with params: ${currToken} ${this.props.channelID} ${messageData.get("message")}`);
            // TODO: Move the event name 'send_message' to a constants file
            socket.emit("send_message", currToken, this.props.channelID, messageData.get("message"));
            const textField = document.getElementById("typingArea");
            textField.value = "";
        }
    }

    fetchMessages() {
        this.setState({
            isLoading: true
        });
        const currToken = Cookie.get("token");
        if (currToken) {
            axios.get(`${BASE_URL}/channels/messages?token=${currToken}&channel_id=${this.props.channelID}&start=0`)
                .then((response) => {
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: true,
                        messages: response.data.messages
                    });
                })
                .catch((err) => {
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Fetching channel messages failed", errorMessage, "danger");
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: false
                    });
                });
        }
    }

    componentDidUpdate() {
        setTimeout(function() {
            console.log("FORCING SCROLL DOWN");
            const messageListContainer = document.getElementById("message-list-container");
            messageListContainer.scrollTop = messageListContainer.scrollHeight * 2;
        }, 200);
    }

    render() {
        return (
            <>
                <div className="content container-fluid bootstrap snippets">
                    <div id="message-list-container" className="chat" style={{overflow: "auto", outline: "none"}} tabIndex="5001">

                        {(this.state.messages && this.state.messages.length > 0) ? (

                            <div class="col-inside-lg decor-default">
                                <div class="chat-body">
                                    {(this.state.isLoading) ? (
                                        <LoadingSpinner />
                                    ) : (
                                        (this.state.fetchSucceeded) ? (
                                            this.state.messages.map((eachMessage, i) => (
                                                <FadeIn key={i} delay="200">
                                                    <Message key={eachMessage.message_id} {...eachMessage}/>
                                                </FadeIn>
                                            ))
                                        ) : (
                                            <p>Message fetch failed...</p>
                                        )
                                    )}  
                                </div>
                            </div>

                        ) : (
                            <EmptyChatIndicator />
                        )}

                    </div>
                </div>

                {/* 'User is typing' prompt */}
                <TypingPrompt isSomeoneElseTyping={this.state.isSomeoneElseTyping} />
                {/* Type a message form: */}
                <Form className="messageForm" onSubmit={this.sendMessage}>
                    <FormGroup className="typingAreaFormGroup">
                        <InputGroup>
                            <Input id="typingArea" type="textarea" placeholder="Type a message" name="message" />
                            <InputGroupAddon addonType="append">
                                <InputGroupText><Button>
                                        <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                                    </Button></InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </FormGroup>

                    

                </Form>
                
            </>
        );
    }
}

export default ChannelMessages;
