import React from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { BASE_URL } from '../../constants/api-routes';
import { Button, Form, FormGroup, FormText, Label, Input } from 'reactstrap';

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
            console.log({
                token: currUserToken,
                name: formData.get("name"),
                description: formData.get("description"),
                visibility: formData.get("visibility")
            });
            const postData = {
                method: 'post',
                url: `${BASE_URL}/channels/create`,
                data: {
                    token: currUserToken,
                    name: formData.get("name"),
                    description: formData.get("description"),
                    visibility: formData.get("visibility")
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
                {/* Channel Name */}
                <FormGroup>
                    <Label for="name">Channel Name</Label>
                    <Input type="text" name="name" id="name" />
                    <FormText>
                        This name will be seen by other users.
                    </FormText>
                </FormGroup>
                {/* Channel Description */}
                <FormGroup>
                    <Label for="description">Channel Description</Label>
                    <Input type="textarea" name="description" id="description" />
                    <FormText>
                        Give a short summary of what this channel is about!
                    </FormText>
                </FormGroup>
                {/* Visibility? */}
                <FormGroup tag="fieldset">
                    <legend>Visibility</legend>
                    <FormGroup check>
                        <Label check>
                            <Input type="radio" name="visibility" value="public" />{' '}
                            Public (anyone can join your channel)
                        </Label>
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Input type="radio" name="visibility" value="private" />{' '}
                            Private (other users must be invited to join your channel)
                        </Label>
                    </FormGroup>
                </FormGroup>
                <br />
                <Button size="lg" color="primary">Submit</Button>
            </Form>
        );
    }
}

export default ChannelForm;
