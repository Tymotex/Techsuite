import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import { UserPlus } from 'react-feather';

import { NeonButton } from '../neon-button';

class RegisterModal extends React.Component {
    static propTypes = {
        register: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
        this.state = {
            modal: false
        };
    }

    toggleModal() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        return (
            <>
                <NeonButton toggleModal={this.toggleModal}>
                    <UserPlus /> Register
                </NeonButton>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Sign Up!</ModalHeader>
                    <Form onSubmit={this.props.register}>
                        <ModalBody>
                            {/* Username: */}
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" name="username" id="username" />
                            </FormGroup>
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
                            {/* Submit button: */}
                        </ModalBody>
                        {/* Buttons in the modal footer: */}
                        <ModalFooter>
                            <Button color="primary">Register</Button>{' '}
                            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </>
        );
    }
}

export default RegisterModal;
