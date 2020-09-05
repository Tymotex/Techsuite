import React from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Button, Label } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Notification } from '../notification';

class ChannelSearchMessages extends React.Component {
    static propTypes = {
        match: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            channelID: props.match.params.channelID,
            channel: {},
            modal: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.updateChannelInfo = this.updateChannelInfo.bind(this);
    }

    UNSAFE_componentWillMount() {
        const currUserToken = Cookie.get("token");
        if (currUserToken) {
            // Now fetch the user's bio 
            axios.get(`${BASE_URL}/channels/details?token=${currUserToken}&channel_id=${this.state.channelID}`)
                .then((channel) => {
                    this.setState({
                        channel: channel.data
                    });
                })
                .catch((err) => {
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Fetching channel details failed", errorMessage, "danger");
                });
        } else {
            this.setState({
                isLoading: false,
                fetchSucceeded: false
            });
            Notification.spawnNotification("Failed", "Please log in first", "danger");
        }
    }

    updateChannelInfo(event) {
        event.preventDefault();
        console.log("Updating channel info");
        const fd = new FormData(event.target);
        
        const currUserToken = Cookie.get("token");
        console.log("Token: " + currUserToken);
        console.log("ChannelID: " + this.state.channelID);

        if (currUserToken) {
            const postData = {
                method: 'put',
                url: `${BASE_URL}/channels/update`,
                data: {
                    token: currUserToken,
                    channel_id: this.state.channelID,
                    name: fd.get("name"),
                    description: fd.get("description"),
                    visibility: (fd.get("visibility") != null) ? true : false
                },
                headers: { "Content-Type": "application/json" }
            }
            axios(postData)
                .then(() => {
                    console.log("Successfullly updated channel info");
                    window.location.reload();
                })
                .catch((err) => {
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Channel update failed", errorMessage, "danger");
                });
        }
    }

    toggleModal() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        const { name, description, visibility } = this.state.channel;
        return (
            <>
                <Button color="secondary" onClick={this.toggleModal} style={{"width": "100%"}}>Search Messages</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <Notification />
                    <ModalHeader toggle={this.toggleModal}>Searching Channel Messages:</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.updateChannelInfo}>
                            <FormGroup>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>Search for</InputGroupText>
                                    </InputGroupAddon>
                                    <Input name="searchMessage" placeholder="eg. good movie" />
                                </InputGroup>
                            </FormGroup>
                            <ModalFooter>
                                <Button color="primary">Search</Button>{' '}
                                <Button type="button" color="secondary" onClick={this.toggleModal}>Cancel</Button>
                            </ModalFooter>
                        </Form>
                    </ModalBody>
                    {/* Buttons in the modal footer: */}
                </Modal>
            </>
        );
    }
}

export default withRouter(ChannelSearchMessages);
