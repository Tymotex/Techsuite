import React from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LogIn } from 'react-feather';

class LogInModal extends React.Component {
    static propTypes = {
        match: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
        this.logInUser = this.logInUser.bind(this);
        this.state = {
            modal: false
        };
    }

    logInUser(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const postData = {
            method: 'post',
            url: `${BASE_URL}/auth/login`,
            data: {
                email: data.get("email"),
                password: data.get("password")
            },
            headers: {
                "Content-Type": "application/json"
            }
        };
        axios(postData)
            .then((res) => {
                console.log(res);
                console.log("Successfully logged in");
                // Storing the JWT token inside the browser session storage 
                Cookie.set("token", res.data.token);
                Cookie.set("user_id", res.data.user_id);
                this.props.history.push("/home");
                this.toggleModal();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    toggleModal() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        return (
            <>
                <Button color="primary" onClick={this.toggleModal}><LogIn /> Log In</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Welcome back!</ModalHeader>
                    <Form onSubmit={this.logInUser}>
                        <ModalBody>
                                {/* Email Address: */}
                                <FormGroup>
                                    <Label htmlFor="email">Email</Label>
                                    <Input type="email" name="email" id="email" />
                                </FormGroup>
                                {/* Password: */}
                                <FormGroup>
                                    <Label htmlFor="password">Password</Label>
                                    <Input type="password" name="password" id="password" />
                                </FormGroup>
                        </ModalBody>
                        {/* Buttons in the modal footer: */}
                        <ModalFooter>
                            <Button color="primary">Sign In</Button>{' '}
                            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </>
        );
    }
}

export default withRouter(LogInModal);
