import React from 'react';
import { Form } from 'reactstrap';
import Cookie from 'js-cookie';
import axios from 'axios';
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
    }

    componentWillMount() {
        this.fetchMessages();
    }

    sendMessage(event) {
        event.preventDefault();
        const fd = new FormData(event.target);
        const message = fd.get("message");
        const currToken = Cookie.get("token");
        const { userID } = this.props;
        if (currToken) {
            const postData = {
                method: 'post',
                url: `${BASE_URL}/connections/message`,
                data: {
                    token: currToken,
                    user_id: userID,
                    message: message
                },
                headers: { "Content-Type": "application/json" }
            };
            axios(postData)
                .then((res) => {
                    alert("Succeeded");
                    document.getElementById("message-field").value = "";
                })
                .catch((err) => {
                    alert("Failed");
                    document.getElementById("message-field").value = "";
                });
        } else {
    
        }
    }

    fetchMessages() {
        const currToken = Cookie.get("token");
        const { user_id: userID } = this.props.user;
        if (currToken) {
            axios.get(`${BASE_URL}/connections/message?token=${currToken}&user_id=${userID}`)
                .then((messagePayload) => {
                    this.setState({
                        messages: messagePayload.data.messages
                    });
                    alert("Successful fetch");
                })
                .catch((err) => {
                    alert("Failed fetch");
                });
        } else {
    
        }
    }


    render() {
        const { messages } = this.state;
        const { user } = this.props;
        return (        
            <div className="Chat-wrap">
                {/* Chat display */}
                <div className="ChatDisplay" style={{"height": "350px"}}>
                    {messages.map((eachMessage) => (
                        <ConnectionMessage message={eachMessage} user={user} isOutgoing={true} />
                    ))}
                </div>
                {/* Message Form: */}
                <Form onSubmit={this.sendMessage}>
                    <div className="p-a-sm b-t bg-white">
                        <div className="input-group">
                            <input id="message-field" type="text" name="message" className="form-control" placeholder="Say something" />
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
