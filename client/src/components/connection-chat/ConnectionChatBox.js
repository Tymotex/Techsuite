import axios from 'axios';
import Cookie from 'js-cookie';
import React from 'react';
import FadeIn from 'react-fade-in';
import { Form } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import ConnectionMessage from './ConnectionMessage';

class ConnectionChatBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.fetchMessages = this.fetchMessages.bind(this);

        // Binding socket event listeners:
        const { socket } = this.props;
        socket.on("receive_connection_message", (message) => {
            console.log(`Received message: ${message}`);
            this.fetchMessages();
        });
        socket.on("connection_message_edited", (message) => {
            console.log(`Received message: ${message}`);
            this.fetchMessages();
        });
        socket.on("connection_message_removed", (message) => {
            console.log(`Received message: ${message}`);
            this.fetchMessages();
        });
    }

    componentWillMount() {
        this.fetchMessages();
    }

    componentDidUpdate() {
        setTimeout(function() {
            const messageListContainer = document.getElementById("connection-messages-container");
            if (messageListContainer) {
                messageListContainer.scrollTop = messageListContainer.scrollHeight;
            }
        }, 200);
    }

    sendMessage(event) {
        event.preventDefault();
        const { socket, room } = this.props;
        const fd = new FormData(event.target);
        const message = fd.get("message");
        const currToken = Cookie.get("token");
        const { user_id: userID } = this.props.otherUser;
        if (currToken) {
            socket.emit("send_connection_message", currToken, userID, message, room);
            document.getElementById("message-field").value = "";
        } else {
            // TODO
        }
    }

    fetchMessages() {
        const currToken = Cookie.get("token");
        const { user_id: userID } = this.props.otherUser;
        if (currToken) {
            axios.get(`${BASE_URL}/connections/message?token=${currToken}&user_id=${userID}`)
                .then((messagePayload) => {
                    this.setState({
                        messages: messagePayload.data.messages
                    });
                })
                .catch((err) => {
                    alert("Failed fetch");
                });
        } else {
            // TODO
        }
    }

    render() {
        const { messages } = this.state;
        const { otherUser, thisUser, room } = this.props;
        const thisUserID = thisUser.user_id;
        return (
            <div className="Chat-wrap">
                <div id="connection-messages-container" className="chat" style={{overflow: "auto", outline: "none"}} tabIndex="5001">
                    {(messages && messages.length > 0) ? (
                        <div className="col-inside-lg decor-default">
                            <div className="chat-body">
                                {messages.map((eachMessage, i) => (
                                    <FadeIn key={i} delay="200">
                                        <ConnectionMessage 
                                            message={eachMessage} 
                                            otherUser={otherUser} 
                                            thisUser={thisUser} 
                                            isOutgoing={eachMessage.sender_id === thisUserID} 
                                            room={room} 
                                        />
                                    </FadeIn>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p></p>
                    )}
                </div>
                {/* Message Form: */}
                <Form onSubmit={this.sendMessage}>
                    <div className="p-a-sm b-t bg-white">
                        <div className="input-group">
                            <input 
                                id="message-field" 
                                type="text" 
                                name="message" 
                                className="form-control" 
                                placeholder="Say something"
                                autoComplete="off" />
                            <span className="input-group-btn m-l-sm">
                                <button className="btn bg-white b-a no-shadow">
                                    <i className="fa fa-send" />
                                    <span className="sr-only">Send Message</span>
                                </button>
                            </span>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}

export default ConnectionChatBox;
