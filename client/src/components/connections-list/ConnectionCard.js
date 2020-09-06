import React from 'react';
import { Row, Col, Card, CardHeader, CardBody, Button } from 'reactstrap';
import './ConnectionCard.scss';

class ConnectionCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { user } = this.props;
        return (
            <Card className="connection-card" body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                <img className="connection-card-image" src={user.profile_img_url} />
                <CardHeader className="connection-card-header">{user.username}</CardHeader>
                <CardBody className="connection-card-body">
                    <div>
                        <Button outline color="primary">Accept</Button>
                        <Button outline color="danger">Decline</Button>
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export default ConnectionCard;

