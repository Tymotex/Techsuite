import axios from 'axios';
import Cookie from 'js-cookie';
import React, { Component } from 'react';
import { ChannelList } from '../../components/channel-list';
import { errorNotification } from '../../components/error-notification';
import { LoadingSpinner } from '../../components/loading-spinner';
import { Notification } from '../../components/notification';
import { BASE_URL } from '../../constants/api-routes';
import Empty from './Empty';

class ChannelsMy extends Component {
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

    componentDidMount() {
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
                    errorNotification(err, "Couldn't list all channels");
                })
        } else {
            Notification.spawnNotification("Can't load your channels", "Please log in first", "danger");
            this.setState({
                isLoading: false,
                fetchSucceeded: false
            });
        }
    }

    render() {
        return (
            <div>
                {(this.state.isLoading) ? (
                    <LoadingSpinner /> 
                ) : (
                    (this.state.fetchSucceeded) ? (
                        <ChannelList {...this.state} showPrompt={true} />
                    ) : (
                        <Empty />
                    )
                )}
            </div>
        );
    }
}

export default ChannelsMy;
