import React from 'react';
import OutgoingMessage from './OutgoingMessage';
import IncomingMessage from './IncomingMessage';

class ConnectionMessage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { message, otherUser, thisUser } = this.props;
        return (
            (this.props.isOutgoing) ? 
                <OutgoingMessage 
                    message_id={message.message_id}
                    message={message.message}
                    time_created={message.time_created}
                    user={thisUser}
                /> :
                <IncomingMessage 
                    message_id={message.message_id}
                    message={message.message}
                    time_created={message.time_created}
                    user={otherUser}
                />
        );
    }
}

export default ConnectionMessage;
