import React from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { BASE_URL } from '../../constants/api-routes';
import { ChannelForm } from '../../components/channel-form';
import { Notification } from '../../components/notification';

class ChannelsNew extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Notification />
                <h1>Create a New Channel:</h1>
                <ChannelForm />
            </div>
        );
    }
}

export default ChannelsNew;
