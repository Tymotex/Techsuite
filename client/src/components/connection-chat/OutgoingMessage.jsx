import moment from 'moment-timezone';
import React from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import MessageEditButton from './MessageEditButton';

class OutgoingMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            user: {},
            tooltipOpen: false
        };
    }

    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }

    render() {
        // Creating a formatted time string based on the time_created unix timestamp
        // Example time format: 05/20/2020 | 7:55PM (AEST)
        const { message_id, message, time_created, user } = this.props;
        const { profile_img_url, username, user_id } = user;

        const formattedTime = moment.unix(time_created).tz("Australia/Sydney").format("DD/MM/YYYY | h:mmA (z)");
        const shortFormattedTime = moment.unix(time_created).tz("Australia/Sydney").format("DD/MM/YY, h:mm A");
        return (
            <div className="answer right">
                <Link to={`/user/profile/${user_id}`}>    
                    <div className="avatar" >
                        <img src={profile_img_url} alt={username} />
                    </div>
                </Link>
                <div className="name"><strong>{username}</strong></div>
                <div className="text" data-tip data-for='messageTooltip'>
                    <div>
                        {message}
                    </div>
                </div>
                <ReactTooltip id='messageTooltip' type='info' effect="solid" delayShow={200} delayHide={200} >
                    <span>{formattedTime}</span>
                </ReactTooltip>
                <div className="time">
                    <MessageEditButton messageID={message_id} message={message} />
                    <span>
                        {shortFormattedTime}
                    </span>
                </div>
            </div>
        );
    }
}

export default OutgoingMessage;