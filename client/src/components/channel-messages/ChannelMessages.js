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
                    alert(err);
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: false
                    });
                });
        }
    }

    
    componentDidUpdate() {
        const messageListContainer = document.getElementById("message-list-container");
        messageListContainer.scrollTop = messageListContainer.scrollHeight;
    }

    render() {
        console.log(this.state.messages);
        return (
            <>
                <div class="content container-fluid bootstrap snippets">
                    <div class="row row-broken">
                        <div class="col-sm-3 col-xs-12">
                        <div class="col-inside-lg decor-default chat" style={{overflow: "auto", outline: "none"}} tabindex="5000">
                            <div class="chat-users">
                                <h6>Online</h6>
                                <div class="user">
                                    <div class="avatar">
                                    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="User name" />
                                    <div class="status off"></div>
                                    </div>
                                    <div class="name">User name</div>
                                    <div class="mood">User mood</div>
                                </div>
                                <div class="user">
                                    <div class="avatar">
                                    <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="User name" />
                                    <div class="status online"></div>
                                    </div>
                                    <div class="name">User name</div>
                                    <div class="mood">User mood</div>
                                </div>
                                <div class="user">
                                    <div class="avatar">
                                    <img src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="User name" />
                                    <div class="status busy"></div>
                                    </div>
                                    <div class="name">User name</div>
                                    <div class="mood">User mood</div>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div id="message-list-container" class="col-sm-9 col-xs-12 chat" style={{overflow: "auto", outline: "none"}} tabindex="5001">
                            <div class="col-inside-lg decor-default">
                                <div class="chat-body">
                                <h6>Mini Chat</h6>
                                {(this.state.isLoading) ? (
                                    <LoadingSpinner />
                                ) : (
                                    (this.state.fetchSucceeded) ? (
                                        this.state.messages.map((eachMessage) => (
                                            <Message key={eachMessage.message_id} {...eachMessage}/>
                                        ))
                                    ) : (
                                        <p>Message fetch failed</p>
                                    )
                                )}  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 'User is typing' prompt */}
                <TypingPrompt isSomeoneElseTyping={this.state.isSomeoneElseTyping} />
                {/* Type a message form: */}
                <Form className="messageForm" onSubmit={this.sendMessage}>
                    <FormGroup className="typingAreaFormGroup">
                        <Input id="typingArea" type="textarea" placeholder="Type a message" name="message" />
                        <Button className="msg_send_btn" color="primary">
                            <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                        </Button>
                    </FormGroup>
                </Form>
            </>
        );
    }
}

export default ChannelMessages;
