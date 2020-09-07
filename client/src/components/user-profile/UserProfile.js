import axios from 'axios';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import React from 'react';
import { Card, Col, Row, CardBody } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import "./UserProfile.scss";
import UserChannels from './UserChannels'; 
import UserBio from './UserBio';
import { Notification } from '../notification';
import { LoadingSpinner } from '../loading-spinner';
import ConnectButton from './ConnectButton';
import { ConnectionChat } from '../connection-chat';

class UserProfile extends React.Component {
    static propTypes = {
        userID: PropTypes.number.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            user: {},
            bio: {},
            chatWindowOpen: false
        };
        this.toggleChatWindow = this.toggleChatWindow.bind(this);
        this.forceCloseChatWindow = this.forceCloseChatWindow.bind(this);
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        });
        const currUserToken = Cookie.get("token");
        if (currUserToken) {
            axios.get(`${BASE_URL}/users/profile?token=${currUserToken}&user_id=${this.props.userID}`)
                .then((userProfile) => {
                    // Now fetch the user's bio 
                    axios.get(`${BASE_URL}/users/bio?token=${currUserToken}&user_id=${this.props.userID}`)
                        .then((userBio) => {
                            this.setState({
                                isLoading: false,
                                fetchSucceeded: true,
                                user: userProfile.data,
                                bio: userBio.data
                            });
                        })
                        .catch((err) => {
                            const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                            Notification.spawnNotification("Couldn't view profile bio", errorMessage, "danger");
                            this.setState({
                                isLoading: false,
                                fetchSucceeded: false
                            })
                        });
                })
                .catch((err) => {
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Couldn't view profile", errorMessage, "danger");
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: false
                    });
                })
        } else {
            this.setState({
                isLoading: false,
                fetchSucceeded: false
            });
            Notification.spawnNotification("Failed", "Please log in first", "danger");
        }
    }

    toggleChatWindow(userID) {
        const currToken = Cookie.get("token");
        if (currToken) {
            axios.get(`${BASE_URL}/users/profile?token=${currToken}&user_id=${userID}`)
                .then((userPayload) => {
                    this.setState({
                        currentChatUser: userPayload.data,
                        chatWindowOpen: !this.state.chatWindowOpen
                    });
                })
                .catch((err) => {

                });
        }
    }

    forceCloseChatWindow() {
        this.setState({
            chatWindowOpen: false
        });
    }

    render() {
        const { user } = this.state;
        const { user_id, email, username, profile_img_url, is_connected_to, connection_is_pending } = user;
        const { first_name, last_name, cover_img_url, summary, location, title, education} = this.state.bio;
        const coverStyle = {
            "background-image": (cover_img_url != null) ? (
                `url('${cover_img_url}')`
            ) : (
                `linear-gradient(160deg, #4d61de 0%, #0a0026 100%)`
            ), 
            "background-size": "cover"
        }
        return (
            <div>
                <Notification />
                {(this.state.isLoading) ? (
                    <LoadingSpinner /> 
                ) : (
                    (this.state.fetchSucceeded) ? (
                        <div>
                            <Card body>
                                <div className="user-profile text-center" style={coverStyle}>
                                    <div className="user-profile-card">
                                        <div className="m-b">
                                            <img src={profile_img_url} style={{ width: "200px", height: "200px" }} className="b-circle" alt="Profile" />
                                        </div>
                                        <div>
                                            <h2 className="h4"><strong>{`${username}`}</strong></h2>
                                            <div className="user-profile-card-divider">
                                                <hr />
                                            </div>
                                            <div className="h5 text-muted">Name: {(first_name != null || last_name != null) ? first_name + " " + last_name : "not specified"}</div>
                                            <div className="h5 text-muted">Title: {title != null ? title : "unknown"}</div>
                                            <div className="h5 text-muted">Education: {education != null ? education : "unknown"}</div>
                                            <div className="h5 text-muted">Location: {location != null ? location : "unknown"}</div>
                                            <div className="h5 text-muted">Email: {email}</div>
                                            
                                        </div>
                                        {(user_id == Cookie.get("user_id")) ? (
                                            <></>
                                        ) : (
                                            <ConnectButton 
                                                isConnected={is_connected_to} 
                                                connectionIsPending={connection_is_pending} 
                                                openMessage={this.toggleChatWindow}
                                                userID={user_id}/>
                                        )}
                                    </div>
                                </div>
                            </Card>
                            <Row>
                                <Col xs={4}>
                                    <Card>
                                        <CardBody>
                                            <UserBio summary={summary} />
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xs={8}>
                                    <Card>
                                        <CardBody>
                                            <UserChannels />
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    ) : (
                        <></>
                    )
                )}

                {(this.state.chatWindowOpen) ? (
                    <ConnectionChat.Container>
                        <ConnectionChat.ChatBox 
                            name="Messages" 
                            status="online" 
                            close={this.forceCloseChatWindow} 
                            user={user} />
                    </ConnectionChat.Container>
                ) : (
                    <></>
                )}

            </div>
        );
    }  
}

export default UserProfile;
