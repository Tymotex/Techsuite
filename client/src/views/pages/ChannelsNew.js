import React from 'react';
import { ChannelForm } from '../../components/channel-form';

class ChannelsNew extends React.Component {
    render() {
        return (
            <div>
                <h1>Create a New Channel:</h1>
                <ChannelForm />
            </div>
        );
    }
}

export default ChannelsNew;
