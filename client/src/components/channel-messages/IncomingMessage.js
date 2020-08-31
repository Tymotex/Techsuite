import React from 'react';
import moment from 'moment-timezone';
import Cookie from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from '../../constants/api-routes';

// const IncomingMessage = ({ message, time_created }) => {
//     const formattedTime = moment.unix(time_created).tz("Australia/Sydney").format("MM/DD/YYYY  |  h:mmA (z)");
//     return (
//         <div class="answer left">
//             <div class="avatar">
//             <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="User name" />
//             <div class="status offline"></div>
//             </div>
//             <div class="name">Alexander Herthic</div>
//             <div class="text">
//                 {message}
//             </div>
//             <div class="time">{formattedTime}</div>
//         </div>
//     );
// };

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
            <div class="answer left">
                <div class="avatar">
                    <img src={profile_img_url} alt="User name" />
                </div>
                <div class="name">{username}</div>
                <div class="text">
                    {message}
                </div>
                <div class="time">{formattedTime}</div>
            </div>
        );
    }
}

IncomingMessage.defaultProps = {
    message: "No message was passed..."
};

export default IncomingMessage;