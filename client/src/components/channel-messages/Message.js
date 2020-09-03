import React from 'react';
import IncomingMessage from './IncomingMessage';
import OutgoingMessage from './OutgoingMessage';

class Message extends React.Component {
    render() {
        return (
            (this.props.is_author) ? 
                <OutgoingMessage {...this.props} /> :
                <IncomingMessage {...this.props} />
        );
    }
}

export default Message;
