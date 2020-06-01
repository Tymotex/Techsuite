import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LogIn } from 'react-feather';

import { NeonButton } from '../neon-button';

class LogInModal extends React.Component {
    static propTypes = {
        login: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
        this.state = {
            modal: false
        };
    }

    toggleModal() {
        console.log("Toggling");
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        return (
            <>
                <button onClick={this.toggleModal}>
                    <NeonButton>
                        <LogIn /> Log In
                    </NeonButton>
                </button>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Welcome back!</ModalHeader>
                    <Form onSubmit={this.props.login}>
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
                            {/* TODO: Forgot password implementation in the backend */}
                            <NavLink to="/">Forgot password?</NavLink>
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

export default LogInModal;
