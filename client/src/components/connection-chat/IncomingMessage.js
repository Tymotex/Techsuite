import axios from 'axios';
import Cookie from 'js-cookie';
import moment from 'moment-timezone';
import React from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { BASE_URL } from '../../constants/api-routes';
import { Notification } from '../notification';

class IncomingMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            user: {}
        };
    }

    componentDidMount() {;
        this.setState({
            isLoading: true
        });
        const currUserToken = Cookie.get("token");
        const otherUserID = this.props.user.user_id;
        if (currUserToken) {
            axios.get(`${BASE_URL}/users/profile?token=${currUserToken}&user_id=${otherUserID}`)
                .then((userProfile) => {
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: true,
                        user: userProfile.data
                    });
                })
                .catch((err) => {
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: false
                    });
                })
        } else {
            this.setState({
                isLoading: false,
                fetchSucceeded: false
            });
            Notification.spawnNotification("Failed", "Please log in first", "danger");
        }
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