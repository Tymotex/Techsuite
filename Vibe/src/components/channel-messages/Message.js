import React from 'react';
import IncomingMessage from './IncomingMessage';
import OutgoingMessage from './OutgoingMessage';

const Message = (props) => {
    return (
        (props.is_author) ? 
            <OutgoingMessage {...props} /> :
            <IncomingMessage {...props} />
    );
};

export default Message;