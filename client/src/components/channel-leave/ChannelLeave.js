import React from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class UserInvite extends React.Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        channelName: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            channelID: props.match.params.channelID,
            modal: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.leaveChannel = this.leaveChannel.bind(this);
    }

    toggleModal() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    leaveChannel(event) {
        event.preventDefault();
        const currToken = Cookie.get("token");
        if (currToken) {
            const postData = {
                url: `${BASE_URL}/channels/leave`,
                method: "POST",
                data: {
                    token: currToken,
                    channel_id: this.state.channelID
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            axios(postData)
                .then(() => {
                    // TODO: Redirect to all channels page
                })
                .catch((err) => {
                    // TODO: replace alert
                    alert(err);
                });
        }
    }

    render() {
        return (
            <>
                <Button color="danger" onClick={this.toggleModal}>Leave Channel</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Leave {}</ModalHeader>
                    <ModalBody>
                        Are you sure you want to leave this channel?
                    </ModalBody>
                    {/* Buttons in the modal footer: */}
                    <ModalFooter>
                        <Button color="danger" onClick={this.leaveChannel}>Leave</Button>{' '}
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}

export default withRouter(UserInvite);
