import React from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { BASE_URL } from '../../constants/api-routes';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

class ChannelForm extends React.Component {
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
                })
                .catch((err) => {
                    alert(err);
                })
        }
    }

    render() {
        return (
            <Form onSubmit={this.createNewChannel}>
                <FormGroup>
                    <Label for="name">Channel Name</Label>
                    <Input type="text" name="name" id="name" />
                </FormGroup>
                <FormGroup check>
                    <Label check>
                        <Input type="checkbox" name="is_public" />
                        Do you want this to be a public channel?
                    </Label>
                </FormGroup>
                <Button>Submit</Button>
            </Form>
        );
    }
}

export default ChannelForm;
