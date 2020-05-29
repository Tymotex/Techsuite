import React from 'react';

class TypingPrompt extends React.Component {
    render() {
        const { isSomeoneElseTyping } = this.props;
        return (
            <div>
                {(isSomeoneElseTyping) ? (
                    <p>User x is typing</p>
                ) : (
                    <p></p>
                )}
            </div>
        );
    }
};

export default TypingPrompt;
