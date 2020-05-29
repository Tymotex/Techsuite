import React from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import './ChannelMessages.scss';
import { Form, FormGroup, Button, Input } from 'reactstrap';
import Message from './Message';
import { BASE_URL } from '../../constants/api-routes';
import { LoadingSpinner } from '../loading-spinner';

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
                    alert(err);
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: false
                    });
                });
        }
    }

    render() {
        return (
            <div className="inbox_msg">
                <div className="mesgs">
                    <div className="msg_history">
                        {(this.state.isLoading) ? (
                            <LoadingSpinner />
                        ) : (
                            (this.state.fetchSucceeded) ? (
                                this.state.messages.map((eachMessage, i) => (
                                    <Message key={i} {...eachMessage}/>
                                ))
                            ) : (
                                <p>Message fetch failed</p>
                            )
                        )}                        
                    </div>
                    {/* 'User is typing' prompt */}
                    <TypingPrompt isSomeoneElseTyping={this.state.isSomeoneElseTyping} />
                    {/* Type a message form: */}
                    <Form className="type_msg" onSubmit={this.sendMessage}>
                        <FormGroup className="input_msg_write">
                            <Input id="typingArea" type="textarea" placeholder="Type a message" name="message" />
                            <Button className="msg_send_btn" color="primary">
                                <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                            </Button>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        );
    }
}

export default ChannelMessages;
