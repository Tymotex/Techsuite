import React from 'react';

class TypingPrompt extends React.Component {
    render() {
        const { typers } = this.props;
        return (
            <div>
                {typers.map((eachTyper) => (
                    <p>
                        {eachTyper} is typing. 
                    </p>
                ))}
            </div>
        );
    }
};

export default TypingPrompt;
