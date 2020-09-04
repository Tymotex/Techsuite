import React from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { ChannelList } from '../../components/channel-list';
import { BASE_URL } from '../../constants/api-routes';
import { LoadingSpinner } from '../../components/loading-spinner';
import { Notification } from '../../components/notification';

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
                    })
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
            <div>
                <Notification />
                {(this.state.isLoading) ? (
                    <LoadingSpinner /> 
                ) : (
                    (this.state.fetchSucceeded) ? (
                        <div>
                            <ChannelList {...this.state} />
                        </div>
                    ) : (
                        <></>
                    )
                )}
            </div>
        );
    }
}

export default ChannelsAll;
