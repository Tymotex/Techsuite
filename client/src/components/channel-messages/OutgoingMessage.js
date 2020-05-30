import React from 'react';
import moment from 'moment-timezone';

const OutgoingMessage = ({ message, time_created, is_pinned, reacts }) => {
    // Creating a formatted time string based on the time_created unix timestamp
    // Example time format: 05/20/2020 | 7:55PM (AEST)
    const formattedTime = moment.unix(time_created).tz("Australia/Sydney").format("MM/DD/YYYY  |  h:mmA (z)")
    console.log("Outgoing message rerender");
    return (
        <div className="outgoing_msg">
            <div className="sent_msg">
                <p>{message}</p>
                <span className="time_date"> {formattedTime} </span>
            </div>
        </div>
    );
};

OutgoingMessage.defaultProps = {
    message: "No message was passed..."
};

export default OutgoingMessage;