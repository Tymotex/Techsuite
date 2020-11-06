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
import BioField from './BioField';

class UserProfile extends React.Component {
    static propTypes = {
        userID: PropTypes.number.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            currentChatUser: {},
            thisUser: {},
            bio: {},
            chatWindowOpen: false
        };
        this.getCallingUser = this.getCallingUser.bind(this);
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
                                currentChatUser: userProfile.data,
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
        this.getCallingUser();
    }

    getCallingUser() {
        // Fetch the current user's profile data
        const currToken = Cookie.get("token");
        const userID = Cookie.get("user_id");
        if (currToken) {
            axios.get(`${BASE_URL}/users/profile?token=${currToken}&user_id=${userID}`)
                .then((userPayload) => {
                    this.setState({
                        thisUser: userPayload.data,
                        isLoading: false,
                        fetchSucceeded: true
                    });
                })
                .catch((err) => {
                    if (err.data) {
                        const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                        Notification.spawnNotification("Failed to load your details", errorMessage, "danger");
                    } else {
                        Notification.spawnNotification("Failed to load your details", "Something went wrong. Techsuite messed up!", "danger");
                    }
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: false
                    });
                });
        } else {
            Notification.spawnNotification("Can't load your details", "Please log in first!", "danger");
            this.setState({
                isLoading: false,
                fetchSucceeded: false
            });
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
        const { currentChatUser, thisUser } = this.state;
        const { user_id, email, username, profile_img_url, is_connected_to, connection_is_pending } = currentChatUser;
        const { first_name, last_name, cover_img_url, summary, location, title, education} = this.state.bio;
        const coverStyle = {
            "backgroundImage": (cover_img_url != null) ? (
                `url('${cover_img_url}')`
            ) : (
                `radial-gradient(ellipse at bottom, #3d6492 0%, #090A0F 100%)`
            ), 
            "backgroundSize": "cover"
        }
        return (
            <div>
                {(this.state.isLoading) ? (
                    <LoadingSpinner /> 
                ) : (
                    (this.state.fetchSucceeded) ? (
                        <div>
                            <Card body className="main-card top-padded">
                                <div className="user-profile text-center" style={coverStyle}>
                                    <div className="user-profile-card">
                                        <div className="m-b">
                                            <img src={profile_img_url} className="user-profile-image b-circle" alt="Profile" />
                                        </div>
                                        <div>
                                            <h2 className="h4"><strong>{`${username}`}</strong></h2>
                                            <hr className="user-profile-card-divider" />
                                            
                                            <BioField field="Name" value={(first_name != null || last_name != null) ? first_name + " " + last_name : "not specified"} />
                                            <BioField field="Title" value={title != null ? title : "Techsuite user"} />
                                            <BioField field="Education" value={education != null ? education : "unset education"} />
                                            <BioField field="Location" value={location != null ? location : "no location"} />
                                            <BioField field="Email" value={email} />
                                        </div>
                                        {(parseInt(user_id) == parseInt(Cookie.get("user_id"))) ? (
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
                                <Col xs={12} lg={4}>
                                    <Card className="main-card">
                                        <CardBody>
                                            <UserBio summary={summary} />
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xs={12} lg={8}>
                                    <Card className="main-card">
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
                            otherUser={currentChatUser}
                            thisUser={thisUser} />
                    </ConnectionChat.Container>
                ) : (
                    <></>
                )}

            </div>
        );
    }  
}

export default UserProfile;
