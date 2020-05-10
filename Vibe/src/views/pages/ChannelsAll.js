import React, { Component } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { ChannelList } from '../../components/channel-list';
import { ChannelForm } from '../../components/channel-form';
import { BASE_URL } from '../../constants/api-routes';

class ChannelsAll extends Component {
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
            axios.get(`${BASE_URL}/channels/listall?token=${currUserToken}`)
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
        
        /*
        axios.post("http://localhost:8080/channels/create", {
                token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1X2lkIjoxLCJlbWFpbCI6InRpbXpoYW5nM0BnbWFpbC5jb20iLCJwYXNzd29yZCI6IjVlODg0ODk4ZGEyODA0NzE1MWQwZTU2ZjhkYzYyOTI3NzM2MDNkMGQ2YWFiYmRkNjJhMTFlZjcyMWQxNTQyZDgiLCJuYW1lX2ZpcnN0IjoiVGltIiwibmFtZV9sYXN0IjoiWmhhbmciLCJwZXJtaXNzaW9uX2lkIjoxLCJwcm9maWxlX2ltZ191cmwiOm51bGx9.SHjAIdFdokIw2TSLWlAiLTN3Khd-_v8sdF-8a-X_wQo",
                name: "TVFilthyFrank",
                is_public: "True"
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
        */
    }

    render() {
        return (
            <div>
                <ChannelForm />

                <ChannelList {...this.state} />
                
            </div>
        );
    }
}

export default ChannelsAll;
