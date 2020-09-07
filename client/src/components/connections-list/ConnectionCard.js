import React from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { Row, Col, Card, CardHeader, CardBody, Button } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import './ConnectionCard.scss';

class ConnectionCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatWindowOpen: false
        };
        this.acceptConnection = this.acceptConnection.bind(this);
        this.rejectConnection = this.rejectConnection.bind(this);
    }

    acceptConnection() {
        const { user } = this.props;
        const currToken = Cookie.get("token");
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
                    alert("Success");
                })
                .catch((err) => {
                    alert("failed");
                });
        }
    }

    rejectConnection() {
        const { user } = this.props;
        const currToken = Cookie.get("token");
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
                    alert("Success");
                })
                .catch((err) => {
                    alert("failed");
                });
        }
    }

    render() {
        const { user, isPending, isOutgoing, openMessage } = this.props;
        return (
            <>
                <Card className="connection-card" body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                    <img className="connection-card-image" src={user.profile_img_url} />
                    <CardHeader className="connection-card-header">{user.username}</CardHeader>
                    <CardBody className="connection-card-body">
                        <div>
                            {(isOutgoing) ? (
                                    <Button outline color="secondary" disabled={true}>Pending</Button>
                                ) : (
                                    (isPending) ? (
                                        <>
                                            <Button outline color="primary" onClick={this.acceptConnection}>Accept</Button>
                                            <Button outline color="danger" onClick={this.rejectConnection}>Decline</Button>
                                        </>
                                    ) : (
                                        <>
                                            {/* TODO: Open up a chat window on the bottom right */}
                                            <Button outline color="primary" onClick={() => openMessage(user.user_id)}>Message</Button> 
                                            <Button outline color="danger" onClick={this.rejectConnection}>Remove</Button>
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

