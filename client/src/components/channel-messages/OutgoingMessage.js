import React from 'react';
import moment from 'moment-timezone';

const OutgoingMessage = ({ message, time_created }) => {
    // Creating a formatted time string based on the time_created unix timestamp
    // Example time format: 05/20/2020 | 7:55PM (AEST)
    const formattedTime = moment.unix(time_created).tz("Australia/Sydney").format("MM/DD/YYYY  |  h:mmA (z)");
    return (
        <div class="answer right">
            <div class="avatar">
            <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="User name" />
            <div class="status offline"></div>
            </div>
            <div class="name">Alexander Herthic</div>
            <div class="text">
                {message}
            </div>
            <div class="time">{formattedTime}</div>
        </div>
    );
};

OutgoingMessage.defaultProps = {
    message: "No message was passed..."
};

export default OutgoingMessage;