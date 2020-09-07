import React from 'react';
import OutgoingMessage from '../channel-messages/OutgoingMessage';
import IncomingMessage from '../channel-messages/IncomingMessage';

class ConnectionMessage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { message, user } = this.props;
        console.log(message);
        console.log(user);
        return (
            (this.props.isOutgoing) ? 
                <OutgoingMessage 
                    message_id={message.message_id}
                    message={message.message}
                    time_created={message.time_created}
                    user_id={user.user_id}
                    profile_img_url={user.profile_img_url}
                    username={user.username}   
                /> :
                <IncomingMessage {...this.props} />
        );
    }
}

export default ConnectionMessage;
