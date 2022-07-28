import axios from 'axios';
import Cookie from 'js-cookie';
import React from 'react';
import { ChannelList } from '../../components/channel-list';
import { errorNotification } from '../../components/error-notification';
import { LoadingSpinner } from '../../components/loading-spinner';
import { Notification } from '../../components/notification';
import { BASE_URL } from '../../constants/api-routes';
import Empty from './Empty';

class ChannelsAll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            allChannels: [],
            myChannels: [],
            showAll: true
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
                    errorNotification(err, "Viewing all channels failed");
                });
        } else {
            Notification.spawnNotification("Can't load channels", "Please log in first", "danger");
            this.setState({
                isLoading: false,
                fetchSucceeded: false
            });
        }
    }

    render() {
        return (
            (this.state.isLoading) ? (
                <LoadingSpinner /> 
            ) : (
                (this.state.fetchSucceeded) ? (
                    <div>
                        <ChannelList {...this.state} showPrompt={true} />
                    </div>
                ) : (
                    <Empty />
                )
            )
        );
    }
}

export default ChannelsAll;
