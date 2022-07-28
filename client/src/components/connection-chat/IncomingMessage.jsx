import moment from 'moment-timezone';
import React from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

class IncomingMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            user: {}
        };
    }

    render() {
        // Creating a formatted time string based on the time_created unix timestamp
        // Example time format: 05/20/2020 | 7:55PM (AEST)
        const { message, time_created, user } = this.props;
        const { profile_img_url, username, user_id } = user;

        const formattedTime = moment.unix(time_created).tz("Australia/Sydney").format("DD/MM/YYYY | h:mmA (z)");
        const shortFormattedTime = moment.unix(time_created).tz("Australia/Sydney").format("DD/MM/YY, h:mm A");
        return (
            <div class="answer left">
                <Link to={`/user/profile/${user_id}`}>   
                    <div class="avatar">
                        <img src={profile_img_url} alt="User name" />
                    </div>
                </Link>
                <div class="name"><strong>{username}</strong></div>
                <div class="text" data-tip data-for='incomingMessageTooltip'>
                    <span>{message}</span>
                </div>
                <ReactTooltip id='incomingMessageTooltip' type='info' effect="solid" delayShow={200} delayHide={200} >
                    <span>{formattedTime}</span>
                </ReactTooltip>
                <div class="time">{shortFormattedTime}</div>
            </div>
        );
    }
}

IncomingMessage.defaultProps = {
    message: "No message was passed..."
};

export default IncomingMessage;