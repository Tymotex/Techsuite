import React from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Notification } from '../notification';

class UserRemoveOwner extends React.Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            channelID: props.match.params.channelID,
            modal: false,
            isLoading: false,
            fetchSucceeded: false,
            users: []
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.inviteUser = this.inviteUser.bind(this);
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        });
        const currToken = Cookie.get("token");
        if (currToken) {
            axios.get(`${BASE_URL}/channels/details?token=${currToken}&channel_id=${this.state.channelID}`)
                .then((allUsers) => {
                    this.setState({
                        users: allUsers.data.owner_members,
                        isLoading: false,
                        fetchSucceeded: true
                    });
                })
                .catch((err) => {
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: false
                    });
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Couldn't fetch all users", errorMessage, "danger");
                });
        }
    }

    toggleModal() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    inviteUser(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        console.log("Trying to invite user!");
        const currToken = Cookie.get("token");
        console.log(formData.get('user_id'));
        if (currToken) {
            const postData = {
                url: `${BASE_URL}/channels/removeowner`,
                method: "POST",
                data: {
                    token: currToken,
                    channel_id: this.state.channelID,
                    user_id: formData.get("user_id")
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            axios(postData)
                .then(() => {
                    this.toggleModal();
                    window.location.reload();
                })
                .catch((err) => {
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Invitation failed", errorMessage, "danger");
                });
        }
    }

    render() {
        return (
            <>
                <Button color="danger" onClick={this.toggleModal} style={{"width": "100%"}}>Remove Owner</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <Notification />
                    <ModalHeader toggle={this.toggleModal}>Remove an owner:</ModalHeader>
                    <Form onSubmit={this.inviteUser}>
                        <ModalBody>
                            Select a user:
                                <FormGroup>
                                    <Label for="exampleSelect"></Label>
                                    <Input type="select" name="user_id" id="exampleSelect">
                                        {this.state.users.map((eachUser, i) => (
                                            <option key={i} value={eachUser.user_id}>{`${eachUser.username}` }</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                        </ModalBody>
                        {/* Buttons in the modal footer: */}
                        <ModalFooter>
                            <Button color="danger">Remove owner</Button>{' '}
                            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </>
        );
    }
}

export default withRouter(UserRemoveOwner);
