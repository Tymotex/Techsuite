import React from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from '../../constants/api-routes';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import './Message.scss';

class OutgoingMessage extends React.Component {
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
                    })
                })
        } else {
            // TODO: how should this case be handled?
            alert("TOKEN WAS NOT FOUND IN COOKIE");
        }
    }
    
    render() {
        // Creating a formatted time string based on the time_created unix timestamp
        // Example time format: 05/20/2020 | 7:55PM (AEST)
        const { message, time_created, user_id } = this.props;
        console.log(this.state.user);
        const { profile_img_url, username } = this.state.user;

        const formattedTime = moment.unix(time_created).tz("Australia/Sydney").format("MM/DD/YYYY  |  h:mmA (z)");
        return (
            <div class="answer right">
                <Link to={`/user/profile/${user_id}`}>    
                    <div class="avatar">
                        <img src={profile_img_url} alt="User name" />
                    </div>
                </Link>
            <div class="name">{username}</div>
                <div class="text">
                    {message}
                </div>
                <div class="time">{formattedTime}</div>
            </div>
        );
    }
}

export default OutgoingMessage;