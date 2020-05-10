import React from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { BASE_URL } from '../../constants/api-routes';
import { ChannelForm } from '../../components/channel-form';

class ChannelsNew extends React.Component {
    constructor(props) {
        super(props);
        this.createNewChannel = this.createNewChannel.bind(this);
    }

    createNewChannel(event) {
        event.preventDefault();
        const currUserToken = Cookie.get("token");
        if (currUserToken) {
            const formData = new FormData(event.target);
            console.log("IS PUBLIC???", (formData.get("is_public")) ? true : false)
            
            const postData = {
                method: 'post',
                url: `${BASE_URL}/channels/create`,
                data: {
                    token: currUserToken,
                    name: formData.get("name"),
                    is_public: (formData.get("is_public")) ? true : false
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            axios(postData)
                .then((res) => {
                    console.log("Successfully created a channel!");
                    this.forceUpdate();
                })
                .catch((err) => {
                    alert(err);
                })
        }
    }

    render() {
        return (
            <div>
                <h1>Create a New Channel:</h1>
                <ChannelForm />
            </div>
        );
    }
}

export default ChannelsNew;
