import React from 'react';
import './EmptyChatIndicator.scss';

class EmptyChatIndicator extends React.Component {
    render() {
        const { placeholderText } = this.props;
        return (
            <span className="empty-chat-indicator text-muted">
                {placeholderText}
            </span>
        );
    }
}

export default EmptyChatIndicator;
