import axios from 'axios';
import Cookie from 'js-cookie';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { Notification } from '../notification';
import './ConnectionCard.scss';
import './Card.scss';

class ConnectionCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatWindowOpen: false,
            modal: false
        };
        this.acceptConnection = this.acceptConnection.bind(this);
        this.removeConnection = this.removeConnection.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    acceptConnection() {
        const { user } = this.props;
        const currToken = Cookie.get("token");
        const { refreshConnections, refreshIncoming } = this.props;
        if (currToken) {
            const postData = {
                method: 'post',
                url: `${BASE_URL}/connections/accept`,
                data: {
                    token: currToken,
                    user_id: user.user_id
                },
                headers: { "Content-Type": "application/json" }
            };
            axios(postData)
                .then((res) => {
                    Notification.spawnNotification("Success", "You have accepted a connection request", "success");
                    refreshConnections(currToken);
                    refreshIncoming(currToken);
                })
                .catch((err) => {
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Failed to add connection", errorMessage, "danger");
                });
        }
    }

    removeConnection() {
        const { user } = this.props;
        const currToken = Cookie.get("token");
        const { refreshConnections, refreshOutgoing } = this.props;
        if (currToken) {
            const postData = {
                method: 'post',
                url: `${BASE_URL}/connections/remove`,
                data: {
                    token: currToken,
                    user_id: user.user_id
                },
                headers: { "Content-Type": "application/json" }
            };
            axios(postData)
                .then((res) => {
                    Notification.spawnNotification("Success", "You have removed a connection", "success");
                    refreshConnections(currToken);
                    refreshOutgoing(currToken);
                    this.toggleModal(false);
                })
                .catch((err) => {
                    if (err.data) {
                        const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                        Notification.spawnNotification("Failed to remove connection", errorMessage, "danger");
                    } else {
                        Notification.spawnNotification("Failed to remove connection", "Techsuite messed up something. Sorry!", "danger");
                    }
                });
        }
    }

    toggleModal(force=null) {
        if (force != null) {
            this.setState({
                modal: force
            });
        } else {
            this.setState(prevState => ({
                modal: !prevState.modal
            }));
        }
    }

    render() {
        const { user, isPending, isOutgoing, openMessage } = this.props;
        const { first_name, last_name, education, location, summary } = user;
        return (
            <>
                <article class="card">
                    <header class="card-header">
                        <h2>
                            <Link to={`/user/profile/${user.user_id}`} style={{textDecoration: "none", color: "grey"}}>
                                {(first_name && last_name) ? (
                                    `${first_name} ${last_name}`
                                ) : (
                                    "Unknown name"
                                )}
                            </Link>
                        </h2>
                        <p>{education}</p>
                        <p>{location}</p>
                    </header>
                    <div class="card-author">
                            <a class="author-avatar">
                                <Link to={`/user/profile/${user.user_id}`}>
                                    <img src={user.profile_img_url} />
                                </Link>
                            </a>
                            <svg class="half-circle" viewBox="0 0 106 57">
                            <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
                            </svg>
                            
                            <div class="author-name">
                                <div class="author-name-prefix">
                                    {user.username}    
                                </div>
                                <span style={{"color": "darkslategrey"}}>{user.email}</span>
                            </div>
                    </div>
                    <div class="tags">
                        {(isOutgoing) ? (
                            <Button outline color="secondary" disabled={true}>Pending</Button>
                        ) : (
                            (isPending) ? (
                                <>
                                    <a onClick={this.acceptConnection}>Accept</a>
                                    <a onClick={this.removeConnection}>Reject</a>
                                </>
                            ) : (
                                <>
                                    <a onClick={() => openMessage(user.user_id)}>Message</a>
                                    <a onClick={this.toggleModal}>Remove</a>
                                    <Link to={`/user/profile/${user.user_id}`}>Profile</Link>
                                </>
                            )
                        )}
                    </div>
                </article>
                {/* Remove connection confirmation modal */}
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={() => this.toggleModal(false)}>Double checking...</ModalHeader>
                    <ModalBody>
                        <p>Are you sure you want to remove <strong>{user.username}</strong> as a connection?</p>
                        <ModalFooter>
                            <Button color="danger" onClick={this.removeConnection}>Yes</Button>
                            <Button color="secondary" onClick={() => this.toggleModal(false)} type="button">Cancel</Button>
                        </ModalFooter>
                    </ModalBody>
                </Modal>
            </>
        );
    }
}

export default ConnectionCard;

