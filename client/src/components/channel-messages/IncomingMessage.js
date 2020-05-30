import React from 'react';
import moment from 'moment-timezone';

const IncomingMessage = ({ message, time_created }) => {
    const formattedTime = moment.unix(time_created).tz("Australia/Sydney").format("MM/DD/YYYY  |  h:mmA (z)");
    return (
        <div class="answer left">
            <div class="avatar">
            <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="User name" />
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

IncomingMessage.defaultProps = {
    message: "No message was passed..."
};

export default IncomingMessage;