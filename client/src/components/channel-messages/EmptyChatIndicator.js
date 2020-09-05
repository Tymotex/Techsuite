import React from 'react';
import './EmptyChatIndicator.scss';

class EmptyChatIndicator extends React.Component {
    constructor(props) {
        super(props);
    }

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
