import React, { Component } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { ChannelList } from '../../components/channel-list';
import { BASE_URL } from '../../constants/api-routes';

class ChannelsMy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            channels: []
        }
	}
	
	componentWillMount() {
        this.setState({
            isLoading: true
        });
        const currUserToken = Cookie.get("token");
        if (currUserToken) {
            axios.get(`${BASE_URL}/channels/list?token=${currUserToken}`)
                .then((res) => {
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: true,
                        channels: res.data.channels
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
			<div>
				<ChannelList />
			</div>
		);
	}
}

export default ChannelsMy;
