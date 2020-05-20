import React from 'react';

const IncomingMessage = ({ message, time_created, is_pinned, reacts }) => {
    return (
        <div className="incoming_msg">
            <div className="incoming_msg_img">
                <img src="https://ptetutorials.com/images/user-profile.png" alt="USERNAME" />
            </div>
            <div className="received_msg">
                <div className="received_withd_msg">
                    <p>{message}</p>
                    <span className="time_date"> 11:01 AM    |    June 9</span>
                </div>
            </div>
        </div>
    );
};

IncomingMessage.defaultProps = {
    message: "No message was passed..."
};

export default IncomingMessage;