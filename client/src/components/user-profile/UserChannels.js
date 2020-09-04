import React from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { ChannelList } from '../../components/channel-list';
import { BASE_URL } from '../../constants/api-routes';
import './BioEditForm.scss';
import { Notification } from '../../components/notification';

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
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Viewing channel list failed", errorMessage, "danger");
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: false
                    })
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
                <div className="title-hr">
                    <hr />
                </div>
                <ChannelList {...this.state}/>
            </div>
        );
    }
}

export default UserChannels;
