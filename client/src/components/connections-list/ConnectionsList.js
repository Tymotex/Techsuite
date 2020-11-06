import React from 'react';
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import { ConnectionCard } from './';
import { ConnectionChat } from '../connection-chat';
import axios from 'axios';
import Cookie from 'js-cookie';
import { BASE_URL } from '../../constants/api-routes';
import { ConnectionSearch } from '../connection-search';
import { Notification } from '../notification';
import { LoadingSpinner } from '../loading-spinner';
import { EmptyFiller } from '../empty-filler';
import cardStyles from './Card.module.scss';


class ConnectionsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            chatWindowOpen: false,
            currentChatUser: {},
            thisUser: {},
            users: {},
            incomingUsers: {},
            outgoingUsers: {}
        };
        this.toggleChatWindow = this.toggleChatWindow.bind(this);
        this.forceCloseChatWindow = this.forceCloseChatWindow.bind(this);
        this.fetchConnections = this.fetchConnections.bind(this);
        this.fetchConnectionsIncoming = this.fetchConnectionsIncoming.bind(this);
        this.fetchConnectionsOutgoing = this.fetchConnectionsOutgoing.bind(this);
    }
    
    componentWillMount() {
        this.setState({
            isLoading: true
        });
        // Fetch the current user's profile data
        const currToken = Cookie.get("token");
        const userID = Cookie.get("user_id");
        if (currToken) {
            axios.get(`${BASE_URL}/users/profile?token=${currToken}&user_id=${userID}`)
                .then((userPayload) => {
                    this.setState({
                        thisUser: userPayload.data,
                        isLoading: false,
                        fetchSucceeded: true
                    });
                })
                .catch((err) => {
                    if (err.data) {
                        const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                        Notification.spawnNotification("Failed to add connection", errorMessage, "danger");
                    } else {
                        Notification.spawnNotification("Failed to add connection", "Something went wrong. Techsuite messed up!", "danger");
                    }
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: false
                    });
                });
            // TODO: Async refactor so that this.setState({ isloading, fetchsucceeded, ...}) works
            this.fetchConnections(currToken);
            this.fetchConnectionsIncoming(currToken);
            this.fetchConnectionsOutgoing(currToken);
        } else {
            Notification.spawnNotification("Can't load your connections", "Please log in first!", "danger");
            this.setState({
                isLoading: false,
                fetchSucceeded: false
            });
        }
    } 

    fetchConnections(token) {
        // alert("Fetching all connections");
        axios.get(`${BASE_URL}/connections?token=${token}`)
            .then((connectionsPayload) => {
                this.setState({
                    users: connectionsPayload.data.users
                });
            })
            .catch((err) => {
                const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                Notification.spawnNotification("Fetching connections failed", errorMessage, "danger");
            });
    }

    fetchConnectionsIncoming(token) {
        // alert("Fetching incoming");
        axios.get(`${BASE_URL}/connections/incoming?token=${token}`)
            .then((connectionsPayload) => {
                this.setState({
                    incomingUsers: connectionsPayload.data.users
                });
            })
            .catch((err) => {
                const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                Notification.spawnNotification("Fetching connections failed", errorMessage, "danger");
            });
    }

    fetchConnectionsOutgoing(token) {
        // alert("Fetching outgoing");
        axios.get(`${BASE_URL}/connections/outgoing?token=${token}`)
            .then((connectionsPayload) => {
                this.setState({
                    outgoingUsers: connectionsPayload.data.users
                });
            })
            .catch((err) => {
                const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                Notification.spawnNotification("Fetching connections failed", errorMessage, "danger");
            });
    }

    toggleChatWindow(userID) {
        const currToken = Cookie.get("token");
        if (currToken) {
            axios.get(`${BASE_URL}/users/profile?token=${currToken}&user_id=${userID}`)
                .then((userPayload) => {
                    this.setState({
                        currentChatUser: userPayload.data,
                        chatWindowOpen: !this.state.chatWindowOpen
                    });
                })
                .catch((err) => {
                    alert("FAILED");
                });
        }
    }

    forceCloseChatWindow() {
        this.setState({
            chatWindowOpen: false
        });
    }

    render() {
        const { isLoading, fetchSucceeded, users, incomingUsers, outgoingUsers, currentChatUser, thisUser } = this.state;
        return (
            <div>
                {(isLoading) ? (
                    <LoadingSpinner />
                ) : (
                    (fetchSucceeded) ? (
                        <Row>
                            <Col md={12}>
                                <ConnectionSearch refreshOutgoing={this.fetchConnectionsOutgoing} />
                            </Col>
                            <Col md={12}>
                                {/* Showing all existing connections */}
                                <Card className={cardStyles.card} >
                                    <CardHeader>
                                        <h3 className={cardStyles.title}>Contacts</h3>
                                    </CardHeader>
                                    <CardBody>
                                        <span className="text-muted">You are currently connected with these people:</span>
                                        <hr className={cardStyles.divider} />
                                        {(users && users.length > 0) ? (
                                            <section class="card-list">
                                                {(users.map((eachUser) => (
                                                    <ConnectionCard 
                                                        user={eachUser} 
                                                        isPending={false} 
                                                        isOutgoing={false} 
                                                        openMessage={this.toggleChatWindow}
                                                        refreshConnections={this.fetchConnections}
                                                        refreshIncoming={this.fetchConnectionsIncoming}
                                                        refreshOutgoing={this.fetchConnectionsOutgoing}
                                                    />
                                                )))}
                                            </section>
                                        ) : (
                                            <p>You currently have no connections</p>
                                        )}
                                    </CardBody>
                                </Card>
                            </Col>
                            {/* Showing all pending incoming request */}
                            <Col md={6}>
                                <Card className={cardStyles.card} >
                                    <CardHeader>
                                        <h3 className={cardStyles.title}>Connection Requests</h3>
                                    </CardHeader>
                                    <CardBody>
                                        <span className="text-muted">These people would like to connect with you:</span>
                                        <hr className={cardStyles.divider} />
                                        {(incomingUsers && incomingUsers.length > 0) ? (
                                            <section class="card-list">
                                                {(incomingUsers.map((eachUser) => (
                                                    <ConnectionCard 
                                                        user={eachUser} 
                                                        isPending={true} 
                                                        isOutgoing={false}
                                                        refreshConnections={this.fetchConnections}
                                                        refreshIncoming={this.fetchConnectionsIncoming}
                                                        refreshOutgoing={this.fetchConnectionsOutgoing} />
                                                )))}
                                            </section>
                                        ) : (
                                            <p className="text-muted">No incoming requests</p>
                                        )}
                                    </CardBody>
                                </Card>
                            </Col>
                            {/* Showing all pending outgoing request */}
                            <Col md={6}>
                                <Card className={cardStyles.card} >
                                    <CardHeader>
                                        <h3 className={cardStyles.title}>Pending Connection Requests</h3>
                                    </CardHeader>
                                    <CardBody>
                                        <p className="text-muted">
                                            You have sent a connection request to these people:
                                        </p>
                                        <hr className={cardStyles.divider} />
                                        {(outgoingUsers && outgoingUsers.length > 0) ? (
                                            <section class="card-list">
                                                {(outgoingUsers.map((eachUser) => (
                                                    <ConnectionCard 
                                                        user={eachUser} 
                                                        isPending={true} 
                                                        isOutgoing={true}
                                                        refreshConnections={this.fetchConnections}
                                                        refreshIncoming={this.fetchConnectionsIncoming}
                                                        refreshOutgoing={this.fetchConnectionsOutgoing} />
                                                )))}
                                            </section>
                                        ) : (
                                            <></>
                                        )}
                                    </CardBody>
                                </Card>
                            </Col>
                            {(this.state.chatWindowOpen) ? (
                                <ConnectionChat.Container>
                                    <ConnectionChat.ChatBox 
                                        name="Messages" 
                                        status="online" 
                                        close={this.forceCloseChatWindow} 
                                        otherUser={currentChatUser}
                                        thisUser={thisUser} />
                                </ConnectionChat.Container>
                            ) : (
                                <></>
                            )}
                        </Row>
                    ) : (
                        <EmptyFiller />
                    )
                )}
            </div>
        );
    }
}

export default ConnectionsList;