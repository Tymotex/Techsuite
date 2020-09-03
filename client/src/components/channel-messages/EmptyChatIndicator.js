import React from 'react';
import './EmptyChatIndicator.scss';

class EmptyChatIndicator extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span className="empty-chat-indicator text-muted">
                Send the first message! 
                <br />                
                Type a message in the box below.
            </span>
        );
    }
}

export default EmptyChatIndicator;
