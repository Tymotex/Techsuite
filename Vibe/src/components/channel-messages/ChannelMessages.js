import React from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import './ChannelMessages.scss';
import { Form, FormGroup, Button, Input } from 'reactstrap';
import Message from './Message';
import { BASE_URL } from '../../constants/api-routes';

class ChannelMessages extends React.Component {
    constructor(props) {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            messages: []
        };
    }

    componentWillMount() {
        this.fetchMessages();
    }

    sendMessage(event) {
        console.log("Form submitted");
        event.preventDefault();
        const messageData = new FormData(event.target);
        const currToken = Cookie.get("token");
        if (currToken) {
            console.log("RECEIVED: ", messageData.get("message"))
            const postData = {
                url: `${BASE_URL}/message/send`,
                method: "POST",
                data: {
                    token: currToken,
                    channel_id: this.props.channelID,
                    message: messageData.get("message")
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            axios(postData)
                .then((response) => {
                    console.log("Message successfully sent!");
                    this.fetchMessages();
                })
                .catch((err) => {
                    alert(err);
                });
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
                    console.log(this.state);
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
            (this.state.isLoading) ?
                <p>Loading messages...</p> :
                (this.state.fetchSucceeded) ? 
                    <div className="inbox_msg">
                        <div className="mesgs">
                            <div className="msg_history">
                                {this.state.messages.map((eachMessage, i) => (
                                    <Message key={i} {...eachMessage}/>
                                ))}
                            </div>
                            {/* Type a message form: */}
                            <Form className="type_msg" onSubmit={this.sendMessage}>
                                <FormGroup className="input_msg_write">
                                    <Input type="textarea" placeholder="Type a message" name="message" />
                                    <Button className="msg_send_btn" color="primary">
                                        <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                                    </Button>
                                </FormGroup>
                            </Form>
                        </div>
                    </div> :
                    <p>Message fetch failed</p>
        );
    }
}

export default ChannelMessages;
