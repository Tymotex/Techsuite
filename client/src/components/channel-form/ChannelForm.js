import React from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { withRouter } from 'react-router-dom';
import { BASE_URL } from '../../constants/api-routes';
import { Button, Form, FormGroup, FormText, Label, Input } from 'reactstrap';
import { Notification } from '../notification';
import { errorNotification } from '../error-notification';

class ChannelForm extends React.Component {
    constructor(props) {
        super(props);
        this.createNewChannel = this.createNewChannel.bind(this);
    }

    createNewChannel(event) {
        console.log("Clicked");
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
                    channel_image: formData.get("channelImage"),
                    visibility: formData.get("visibility")
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            axios(postData)
                .then((res) => {
                    // Pushing a route to history will invoke a redirect to that route 
                    this.props.history.push("/channels/my");
                })
                .catch((err) => {
                    errorNotification(err, "Failed to create channel");
                })
        } else {
            Notification.spawnNotification("Failed to create channel", "Please log in first", "danger");
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
                        Give a short summary of what this channel is about
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
                <Button size="lg" color="primary">Create Channel</Button>
            </Form>
        );
    }
}

export default withRouter(ChannelForm);
