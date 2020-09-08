import React from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { Row, Col, Card, CardHeader, CardBody, Button } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import './ConnectionCard.scss';
import { Link } from 'react-router-dom';
import { Notification } from '../notification';

class ConnectionCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatWindowOpen: false
        };
        this.acceptConnection = this.acceptConnection.bind(this);
        this.removeConnection = this.removeConnection.bind(this);
    }

    acceptConnection() {
        const { user } = this.props;
        const currToken = Cookie.get("token");
        const { refreshConnections, refreshIncoming } = this.props;
        if (currToken) {
            const postData = {
                method: 'post',
                url: `${BASE_URL}/connections/accept`,
                data: {
                    token: currToken,
                    user_id: user.user_id
                },
                headers: { "Content-Type": "application/json" }
            };
            axios(postData)
                .then((res) => {
                    Notification.spawnNotification("Success", "You have accepted a connection request", "success");
                    refreshConnections(currToken);
                    refreshIncoming(currToken);
                })
                .catch((err) => {
                    // const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    // Notification.spawnNotification("Failed to add connection", errorMessage, "danger");
                });
        }
    }

    removeConnection() {
        const { user } = this.props;
        const currToken = Cookie.get("token");
        const { refreshConnections, refreshOutgoing } = this.props;
        if (currToken) {
            const postData = {
                method: 'post',
                url: `${BASE_URL}/connections/remove`,
                data: {
                    token: currToken,
                    user_id: user.user_id
                },
                headers: { "Content-Type": "application/json" }
            };
            axios(postData)
                .then((res) => {
                    Notification.spawnNotification("Success", "You have removed a connection", "success");
                    refreshConnections(currToken);
                    refreshOutgoing(currToken);
                })
                .catch((err) => {
                    // const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    // Notification.spawnNotification("Failed to remove connection", errorMessage, "danger");
                });
        }
    }

    render() {
        const { user, isPending, isOutgoing, openMessage } = this.props;
        return (
            <>
                <Card className="connection-card" body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                    <Link to={`/user/profile/${user.user_id}`}>
                        <img className="connection-card-image" src={user.profile_img_url} />
                    </Link>
                    <CardHeader className="connection-card-header">{user.username}</CardHeader>
                    <CardBody className="connection-card-body">
                        <div>
                            {(isOutgoing) ? (
                                    <Button outline color="secondary" disabled={true}>Pending</Button>
                                ) : (
                                    (isPending) ? (
                                        <>
                                            <Button outline color="primary" onClick={this.acceptConnection}>Accept</Button>
                                            <Button outline color="danger" onClick={this.removeConnection}>Decline</Button>
                                        </>
                                    ) : (
                                        <>
                                            {/* TODO: Open up a chat window on the bottom right */}
                                            <Button outline color="primary" onClick={() => openMessage(user.user_id)}>Message</Button> 
                                            <Button outline color="danger" onClick={this.removeConnection}>Remove</Button>
                                        </>
                                    )
                            )}
                        </div>
                    </CardBody>
                </Card>
            </>
        );
    }
}

export default ConnectionCard;

