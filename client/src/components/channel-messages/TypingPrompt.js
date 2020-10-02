import React from 'react';

class TypingPrompt extends React.Component {
    render() {
        const { typers, thisTyper } = this.props;
        console.log(typers);
        console.log(thisTyper);
        const otherTypers = typers.filter((eachTyper) => eachTyper != thisTyper);
        return (
            <div>
                Rendering
                {otherTypers.map((eachTyper) => (
                    <span>
                        {eachTyper} is typing. 
                    </span>
                ))}
            </div>
        );
    }
};

export default TypingPrompt;
