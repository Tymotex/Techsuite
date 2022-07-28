import React from 'react';
import { ChannelForm } from '../../components/channel-form';
import { Card, CardBody } from 'reactstrap';

class ChannelsNew extends React.Component {
    render() {
        return (
            <Card>
                <CardBody>
                    <h1>Create a New Channel:</h1>
                    <hr />
                    <ChannelForm />
                </CardBody>
            </Card>
        );
    }
}

export default ChannelsNew;
