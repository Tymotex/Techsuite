import axios from 'axios';
import Cookie from 'js-cookie';
import React from 'react';
import { ChannelList } from '../../components/channel-list';
import { Notification } from '../../components/notification';
import { BASE_URL } from '../../constants/api-routes';
import { errorNotification } from '../error-notification';
import './BioEditForm.scss';

class UserChannels extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            allChannels: [],
            myChannels: [],
            showAll: false
        };
    }

    UNSAFE_componentWillMount() {
        this.setState({
            isLoading: true
        });
        const currUserToken = Cookie.get("token");
        if (currUserToken) {
            axios.get(`${BASE_URL}/channels/listall?token=${currUserToken}`)
                .then((allChannels) => {
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: true,
                        allChannels: allChannels.data.channels,
                        myChannels: allChannels.data.channels.filter(eachChannel => eachChannel.member_of)
                    });
                })
                .catch((err) => {
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: false
                    });
                    errorNotification(err, "Viewing channel list failed");
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
        return (
            <div>
                <h3>Channels</h3>
                <hr className="user-profile-card-divider" />
                <ChannelList {...this.state} showPrompt={false}/>
            </div>
        );
    }
}

export default UserChannels;
