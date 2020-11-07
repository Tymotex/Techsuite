import React from 'react';
import { 
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter
} from 'reactstrap';
import './ConnectButton.scss';
import Cookie from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from '../../constants/api-routes';
import { Notification } from '../notification';

class ConnectButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: false,
            connectionIsPending: false,
            isRequester: false
        };
        this.sendConnectionRequest = this.sendConnectionRequest.bind(this);
        this.removeConnection = this.removeConnection.bind(this);
        this.getConnectionInfo = this.getConnectionInfo.bind(this);
        this.acceptConnection = this.acceptConnection.bind(this);
    }
    
    componentDidMount() {
        this.getConnectionInfo();
    } 

    getConnectionInfo() {
        console.log(this.props);
        const { userID } = this.props;
        const currToken = Cookie.get("token");
        if (currToken) {
            axios(`${BASE_URL}/connections/info?token=${currToken}&user_id=${userID}`)
                .then((res) => {
                    this.setState({
                        isConnected: res.data.is_connected,
                        connectionIsPending: res.data.connection_is_pending,
                        isRequester: res.data.is_requester
                    });
                })
                .catch((err) => {
                    if (err.data) {
                        const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                        Notification.spawnNotification("Failed to get connection details", errorMessage, "danger");
                    } else {
                        Notification.spawnNotification("Failed to get connection details", "Techsuite messed up something. Sorry!", "danger");
                        console.log(err);
                    }
                });
        }
    }

    sendConnectionRequest(event) {
        event.preventDefault();
        const targetUserID = this.props.userID;
        const currToken = Cookie.get("token");
        if (currToken) {
            // alert(`Sending connection request: ${targetUserID} ${currToken}`);
            const postData = {
                method: 'post',
                url: `${BASE_URL}/connections/request`,
                data: {
                    token: currToken,
                    user_id: targetUserID
                },
                headers: { "Content-Type": "application/json" }
            }
            axios(postData)
                .then((res) => {
                    console.log(res);
                    this.setState({
                        isConnected: false,
                        connectionIsPending: true,
                        isRequester: true
                    });
                })
                .catch((err) => {
                    alert("Failed");
                    alert(err);
                    alert(err.response.data.message);
                });
        } else {

        }
    }

    removeConnection() {
        const { userID, currentChatUser } = this.props;
        const currToken = Cookie.get("token");
        if (currToken) {
            const postData = {
                method: 'post',
                url: `${BASE_URL}/connections/remove`,
                data: {
                    token: currToken,
                    user_id: userID
                },
                headers: { "Content-Type": "application/json" }
            };
            axios(postData)
                .then((res) => {
                    this.setState({
                        isConnected: false,
                        connectionIsPending: false,
                        isRequester: false
                    });
                })
                .catch((err) => {
                    if (err.data) {
                        const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                        Notification.spawnNotification("Failed to remove connection", errorMessage, "danger");
                    } else {
                        Notification.spawnNotification("Failed to remove connection", "Techsuite messed up something. Sorry!", "danger");
                        console.log(err);
                    }
                });
        }
    }

    acceptConnection() {
        const { userID } = this.props;
        const currToken = Cookie.get("token");
        if (currToken) {
            const postData = {
                method: 'post',
                url: `${BASE_URL}/connections/accept`,
                data: {
                    token: currToken,
                    user_id: userID
                },
                headers: { "Content-Type": "application/json" }
            };
            axios(postData)
                .then((res) => {
                    this.setState({
                        isConnected: true,
                        connectionIsPending: false,
                        isRequester: false
                    });
                })
                .catch((err) => {
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Failed to add connection", errorMessage, "danger");
                });
        }
    }

    render() {
        const { isConnected, connectionIsPending, isRequester } = this.state;
        const { userID, currentChatUser, openMessage } = this.props;
        return (
            <>
                <div className="connect-button-container">
                    {(connectionIsPending) ? (
                        (isRequester) ? (
                            <Button disabled={true}>Pending</Button>
                        ) : (
                            <>
                                <Button outline color="primary" onClick={this.acceptConnection}>Accept</Button>
                                <Button outline color="danger" onClick={this.removeConnection}>Reject</Button>
                            </>
                        )
                    ) : (
                        (isConnected) ? (
                            // TODO: Add link here to get to private message page
                            <>
                                <Button outline color="primary" onClick={() => openMessage(userID)}>Message</Button>
                                <Button outline color="danger" onClick={this.removeConnection}>Remove</Button>
                            </>
                        ) : (
                            <Button onClick={this.sendConnectionRequest}>Connect</Button>
                        )
                    )}
                </div>
            </>
        );
    }
}

export default ConnectButton;
