import React, { Component } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { ChannelList } from '../../components/channel-list';
import { BASE_URL } from '../../constants/api-routes';
import { LoadingSpinner } from '../../components/loading-spinner';

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

    componentWillMount() {
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
                })
        } else {
            // TODO: how should this case be handled?
            alert("TOKEN WAS NOT FOUND IN COOKIE");
        }
    }

    render() {
        return (
            (this.state.isLoading) ?
                <LoadingSpinner /> :
                (this.state.fetchSucceeded) ? 
                    <ChannelList {...this.state} /> :
                    <p>Fetch failed. Is the backend running?</p>
        );
    }
}

export default ChannelsMy;
