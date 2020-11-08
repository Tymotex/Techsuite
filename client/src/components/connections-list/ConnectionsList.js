import axios from 'axios';
import Cookie from 'js-cookie';
import React from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import io from 'socket.io-client';
import { BASE_URL, SOCKET_URI } from '../../constants/api-routes';
import { ConnectionChat } from '../connection-chat';
import { ConnectionSearch } from '../connection-search';
import { EmptyFiller } from '../empty-filler';
import { errorNotification } from '../error-notification';
import { LoadingSpinner } from '../loading-spinner';
import { Notification } from '../notification';
import { ConnectionCard } from './';
import cardStyles from './Card.module.scss';

const socket = io(SOCKET_URI);

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
            outgoingUsers: {},
            room: ""
        };
        this.toggleChatWindow = this.toggleChatWindow.bind(this);
        this.forceCloseChatWindow = this.forceCloseChatWindow.bind(this);
        this.fetchConnections = this.fetchConnections.bind(this);
        this.fetchConnectionsIncoming = this.fetchConnectionsIncoming.bind(this);
        this.fetchConnectionsOutgoing = this.fetchConnectionsOutgoing.bind(this);
        this.joinConnectionRoom = this.joinConnectionRoom.bind(this);
        this.leaveConnectionRoom = this.leaveConnectionRoom.bind(this);

        // Binding socket event listeners:
        socket.on("connection_user_entered", (room) => {
            console.log(`You've joined a room: ${room}`);
            this.setState({ room: room });
        });
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
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: false
                    });
                    errorNotification(err, "Failed to add connection");
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
        axios.get(`${BASE_URL}/connections?token=${token}`)
            .then((connectionsPayload) => {
                this.setState({
                    users: connectionsPayload.data.users
                });
            })
            .catch((err) => {
                errorNotification(err, "Fetching connections failed");
            });
    }

    fetchConnectionsIncoming(token) {
        axios.get(`${BASE_URL}/connections/incoming?token=${token}`)
            .then((connectionsPayload) => {
                this.setState({
                    incomingUsers: connectionsPayload.data.users
                });
            })
            .catch((err) => {
                errorNotification(err, "Fetching connections failed");
            });
    }

    fetchConnectionsOutgoing(token) {
        axios.get(`${BASE_URL}/connections/outgoing?token=${token}`)
            .then((connectionsPayload) => {
                this.setState({
                    outgoingUsers: connectionsPayload.data.users
                });
            })
            .catch((err) => {
                errorNotification(err, "Fetching connections failed");
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
                    if (this.state.chatWindowOpen) {
                        this.joinConnectionRoom();
                    } else {
                        this.leaveConnectionRoom();
                    }
                })
                .catch((err) => {
                    errorNotification(err, "Fetching user profile failed");
                });
        }
    }

    leaveConnectionRoom() {
        const { room } = this.state;
        const currToken = Cookie.get("token");
        if (currToken) {
            socket.emit("connection_user_leave", { token: currToken, room: room });
        } else {
            // TODO
        }
    }

    joinConnectionRoom() {
        const currToken = Cookie.get("token");
        const userID = this.state.currentChatUser.user_id;
        if (currToken) {
            socket.emit("connection_user_enter", { token: currToken, user_id: userID });
        } else {
            // TODO
        }
    }

    forceCloseChatWindow() {
        this.setState({
            chatWindowOpen: false
        });
    }

    render() {
        const { isLoading, fetchSucceeded, users, incomingUsers, outgoingUsers, currentChatUser, thisUser, room } = this.state;
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
                                        thisUser={thisUser}
                                        socket={socket}
                                        room={room} />
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