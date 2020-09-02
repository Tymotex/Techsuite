import React from 'react';
import { Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Button } from 'reactstrap';
import Cookie from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from '../../constants/api-routes';

class ChannelEditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false
        };
        this.updateChannelInfo = this.updateChannelInfo.bind(this);
    }

    updateChannelInfo(event) {
        event.preventDefault();
        console.log("Updating channel info");
        const fd = new FormData(event.target);
        
        const currUserToken = Cookie.get("token");
        console.log("Token: " + currUserToken);
        console.log("ChannelID: " + this.props.channelID);

        if (currUserToken) {
            const postData = {
                method: 'post',
                url: `${BASE_URL}/users/bio`,
                data: {
                    token: currUserToken,
                    channel_id: this.props.channelID,
                },
                headers: { "Content-Type": "application/json" }
            }
            axios(postData)
                .then(() => {
                    console.log("Successfullly updated bio");
                    window.location.reload();
                })
                .catch((err) => {
                    alert(err);
                });
        }
    }

    render() {
        const { name, description } = this.props.channel;
        
        return (
            <Form onSubmit={this.updateChannelInfo}>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>Channel name</InputGroupText>
                        </InputGroupAddon>
                        <Input name="name" placeholder="eg. GamerDudes" defaultValue={name} />
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>Description</InputGroupText>
                        </InputGroupAddon>
                        <Input name="description" placeholder="eg. Snow" defaultValue={description}  />
                    </InputGroup>
                </FormGroup>
                <Button color="primary">Update</Button>
            </Form>
        );
    }
}

export default ChannelEditForm;
