import React from 'react';
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import { ConnectionCard } from './';
import { ConnectionChat } from '../connection-chat';
import axios from 'axios';
import Cookie from 'js-cookie';
import { BASE_URL } from '../../constants/api-routes';

class ConnectionsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatWindowOpen: false,
            currentChatUser: {}
        };
        this.toggleChatWindow = this.toggleChatWindow.bind(this);
        this.forceCloseChatWindow = this.forceCloseChatWindow.bind(this);
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

                });
        }
    }

    forceCloseChatWindow() {
        this.setState({
            chatWindowOpen: false
        });
    }

    render() {
        const { users, incomingUsers, outgoingUsers } = this.props;
        const { currentChatUser } = this.state;
        return (
            <div>
                <Row>
                    <Col md={12}>
                        {/* Showing all existing connections */}
                        <Card>
                            <CardHeader>Contacts:</CardHeader>
                            <CardBody>
                                {(users && users.length > 0) ? (
                                    <Row>
                                        {(users.map((eachUser) => (
                                            <Col xs={12} md={6} lg={4} xl={3}>
                                                <ConnectionCard 
                                                    user={eachUser} 
                                                    isPending={false} 
                                                    isOutgoing={false} 
                                                    openMessage={this.toggleChatWindow}
                                                    />
                                            </Col>
                                        )))}
                                    </Row>
                                ) : (
                                    <p>You currently have no connections</p>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                    {/* Showing all pending incoming request */}
                    <Col md={6}>
                        <Card>
                            <CardHeader>Connection Requests</CardHeader>
                            <CardBody>
                                <span>These people would like to connect with you:</span>
                                <hr />
                                {(incomingUsers && incomingUsers.length > 0) ? (
                                    <Row>
                                        {(incomingUsers.map((eachUser) => (
                                            <Col lg={12} xl={6}>
                                                <ConnectionCard user={eachUser} isPending={true} isOutgoing={false} />
                                            </Col>
                                        )))}
                                    </Row>
                                ) : (
                                    <p>No incoming requests</p>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                    {/* Showing all pending outgoing request */}
                    <Col md={6}>
                        <Card>
                            <CardHeader>Pending Connection Requests</CardHeader>
                            <CardBody>
                                You have sent a connection request to these people:
                                <hr />
                                {(outgoingUsers && outgoingUsers.length > 0) ? (
                                    <Row>
                                        {(outgoingUsers.map((eachUser) => (
                                            <Col lg={12} xl={6}>
                                                <ConnectionCard user={eachUser} isPending={true} isOutgoing={true} />
                                            </Col>
                                        )))}
                                    </Row>
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
                                user={currentChatUser} />
                        </ConnectionChat.Container>
                    ) : (
                        <></>
                    )}
                </Row>
            </div>
        );
    }
}

export default ConnectionsList;