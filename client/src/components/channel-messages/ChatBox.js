import React from 'react';
import FadeIn from 'react-fade-in';
import { LoadingSpinner } from '../loading-spinner';
import './ChannelMessages.scss';
import EmptyChatIndicator from './EmptyChatIndicator';
import Message from './Message';


class ChatBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { messages, isLoading, fetchSucceeded } = this.props;
        return (
            <div className="content container-fluid bootstrap snippets">
                <div id="message-list-container" className="chat" style={{overflow: "auto", outline: "none"}} tabIndex="5001">
                    {(messages && messages.length > 0) ? (
                        <div className="col-inside-lg decor-default">
                            <div className="chat-body">
                                {(isLoading) ? (
                                    <LoadingSpinner />
                                ) : (
                                    (fetchSucceeded) ? (
                                        messages.map((eachMessage, i) => (
                                            <FadeIn key={i} delay="200">
                                                <Message key={eachMessage.message_id} {...eachMessage}/>
                                            </FadeIn>
                                        ))
                                    ) : (
                                        <p>Message fetch failed...</p>
                                    )
                                )}  
                            </div>
                        </div>
                    ) : (
                        <EmptyChatIndicator placeholder="Send the first message! Type a message in the box below."/>
                    )}

                </div>
            </div>
        );
    }
}

export default ChatBox;
