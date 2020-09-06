import React from 'react';
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import { ConnectionCard } from './';

class ConnectionsList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { users, incomingUsers, outgoingUsers } = this.props;
        return (
            <div>
                <Row>
                    <Col md={12}>
                        {/* Showing all existing connections */}
                        <Card>
                            <CardHeader>Contacts:</CardHeader>
                            <CardBody>
                                {(users && users.length > 0) ? (
                                    <p>Connections exist!</p>
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
                                    {(incomingUsers && incomingUsers.length > 0) ? (
                                        <Row>
                                            {(incomingUsers.map((eachUser) => (
                                                <Col lg={12} xl={6}>
                                                    <ConnectionCard user={eachUser} />
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
                                {(outgoingUsers && outgoingUsers.length > 0) ? (
                                    <Row>
                                        {(outgoingUsers.map((eachUser) => (
                                            <Col lg={12} xl={6}>
                                                <ConnectionCard user={eachUser} />
                                            </Col>
                                        )))}
                                    </Row>
                                ) : (
                                    <></>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ConnectionsList;