import React from 'react';
import IncomingMessage from './IncomingMessage';
import OutgoingMessage from './OutgoingMessage';

class Message extends React.Component {
    componentDidMount() {
        console.log(`Remounting! ${this.props.message_id}`);
    }

    render() {
        return (
            (this.props.is_author) ? 
                <OutgoingMessage {...this.props} /> :
                <IncomingMessage {...this.props} />
        );
    }
}

export default Message;
