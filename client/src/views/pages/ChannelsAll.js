import React from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { ChannelList } from '../../components/channel-list';
import { BASE_URL } from '../../constants/api-routes';

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

    componentWillMount() {
        this.setState({
            isLoading: true
        });
        const currUserToken = Cookie.get("token");
        if (currUserToken) {
            axios.get(`${BASE_URL}/channels/listall?token=${currUserToken}`)
                .then((allChannels) => {
                    axios.get(`${BASE_URL}/channels/list?token=${currUserToken}`)
                        .then((myChannels) => { 
                            this.setState({
                                isLoading: false,
                                fetchSucceeded: true,
                                allChannels: allChannels.data.channels,
                                myChannels: myChannels.data.channels
                            });
                        })
                        .catch((err) => {
                            this.setState({
                                isLoading: false,
                                fetchSucceeded: false
                            });
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
                <p>Loading channels</p> :
                (this.state.fetchSucceeded) ? 
                    <ChannelList {...this.state} /> :
                    <p>Fetch failed. Is the backend running?</p>
        );
    }
}

export default ChannelsAll;
