import axios from 'axios';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { errorNotification } from '../error-notification';

import buttonStyles from './UserInvite.module.scss';

class UserInvite extends React.Component {
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
            axios.get(`${BASE_URL}/users/all?token=${currToken}`)
                .then((allUsers) => {
                    this.setState({
                        users: allUsers.data.users,
                        isLoading: false,
                        fetchSucceeded: true
                    });
                })
                .catch((err) => {
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: false
                    });
                    errorNotification(err, "Couldn't fetch all users");
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
                url: `${BASE_URL}/channels/invite`,
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
                    errorNotification(err, "Channel invitation failed");
                });
        }
    }

    render() {
        return (
            <>
                <Button className={buttonStyles.button} color="primary" onClick={this.toggleModal} style={{ "width": "100%" }}>Invite Someone</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Invite Someone:</ModalHeader>
                    <Form onSubmit={this.inviteUser}>
                        <ModalBody>
                            Select a user:
                            <FormGroup>
                                <Label for="exampleSelect"></Label>
                                <Input type="select" name="user_id" id="exampleSelect">
                                    {this.state.users.map((eachUser, i) => (
                                        <option key={i} value={eachUser.user_id}>{`${eachUser.username}`}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </ModalBody>
                        {/* Buttons in the modal footer: */}
                        <ModalFooter>
                            <Button color="primary">Invite</Button>{' '}
                            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </>
        );
    }
}

export default withRouter(UserInvite);
