import axios from 'axios';
import Cookie from 'js-cookie';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { errorNotification } from '../error-notification';
import { Notification } from '../notification';
import './Card.scss';
import './ConnectionCard.scss';

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
                    errorNotification(err, "Failed to add connection");
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
                    errorNotification(err, "Failed to remove connection");
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
        const { first_name, last_name, title, location } = user;
        return (
            <>
                <article class="card">
                    <header class="card-header">
                        <h2>
                            <Link to={`/user/profile/${user.user_id}`} style={{textDecoration: "none", color: "grey"}}>
                                <strong>
                                    {(first_name && last_name) ? (
                                        `${first_name} ${last_name}`
                                    ) : (
                                        user.username
                                    )}
                                </strong>
                            </Link>
                        </h2>
                    </header>
                    <div className="information-section">
                        <p>
                            Title: <em>{title ? (title) : ("No title")}</em>
                        </p>
                        <p>
                            Location: <em>{location ? (location) : "No location"}</em>
                        </p>
                    </div>
                    <div class="card-author">
                            <a class="author-avatar" href="/#">
                                <Link to={`/user/profile/${user.user_id}`}>
                                    <img src={user.profile_img_url} alt="user's profile"/>
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
                            <Button className="disabled" outline color="secondary" disabled={true}>Pending</Button>
                        ) : (
                            (isPending) ? (
                                <>
                                    <span className="approve" onClick={this.acceptConnection} href="/#">Accept</span>
                                    <span className="reject" onClick={this.removeConnection} href="/#">Reject</span>
                                </>
                            ) : (
                                <>
                                    <span className="message" onClick={() => openMessage(user.user_id)} href="/#">Message</span>
                                    <span className="reject" onClick={this.toggleModal} href="/#">Remove</span>
                                    <Link className="profile" to={`/user/profile/${user.user_id}`}>Profile</Link>
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

