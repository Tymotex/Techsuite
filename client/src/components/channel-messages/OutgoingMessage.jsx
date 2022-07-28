import axios from 'axios';
import Cookie from 'js-cookie';
import moment from 'moment-timezone';
import React from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { BASE_URL } from '../../constants/api-routes';
import { errorNotification } from '../error-notification';
import { Notification } from '../notification';
import EditButton from './EditButton';
import './Message.scss';

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

    componentDidMount() {;
        this.setState({
            isLoading: true
        });
        const currUserToken = Cookie.get("token");
        if (currUserToken) {
            axios.get(`${BASE_URL}/users/profile?token=${currUserToken}&user_id=${this.props.user_id}`)
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
                    errorNotification(err, "Failed to fetch user profile");
                })
        } else {
            this.setState({
                isLoading: false,
                fetchSucceeded: false
            });
            Notification.spawnNotification("Failed", "Please log in first", "danger");
        }
    }

    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }

    render() {
        // Creating a formatted time string based on the time_created unix timestamp
        // Example time format: 05/20/2020 | 7:55PM (AEST)
        const { message_id, message, time_created, user_id, room } = this.props;
        const { profile_img_url, username } = this.state.user;

        const formattedTime = moment.unix(time_created).tz("Australia/Sydney").format("DD/MM/YYYY | h:mmA (z)");
        const shortFormattedTime = moment.unix(time_created).tz("Australia/Sydney").format("DD/MM/YY, h:mm A");
        return (
            <div className="answer right">
                <Link to={`/user/profile/${user_id}`}>    
                    <div className="avatar" >
                        <img src={profile_img_url} alt="User name" />
                    </div>
                </Link>
                <div className="name"><strong>{username}</strong></div>
                <div className="text" data-tip data-for='messageTooltip'>
                    {message}
                </div>
                <ReactTooltip id='messageTooltip' type='info' effect="solid" delayShow={200} delayHide={200} >
                    <span>{formattedTime}</span>
                </ReactTooltip>
                <div className="time">
                    <EditButton messageID={message_id} message={message} room={room} />
                    <span>
                        {shortFormattedTime}
                    </span>
                </div>
            </div>
        );
    }
}

export default OutgoingMessage;