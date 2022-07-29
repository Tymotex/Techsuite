import axios from 'axios';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Col, Row } from 'reactstrap';
import io from 'socket.io-client';
import { BASE_URL, SOCKET_URI } from '../../constants/api-routes';
import { ConnectionChat } from '../connection-chat';
import ContentContainer from '../container/ContentContainer';
import { errorNotification } from '../error-notification';
import { LoadingSpinner } from '../loading-spinner';
import { Notification } from '../notification';
import BioField from './BioField';
import ConnectButton from './ConnectButton';
import UserBio from './UserBio';
import UserChannels from './UserChannels';
import './UserProfile.scss';

const socket = io(SOCKET_URI);

class UserProfile extends React.Component {
  static propTypes = {
    userID: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      fetchSucceeded: false,
      chatWindowOpen: false,
      currentChatUser: {},
      thisUser: {},
      bio: {},
      room: '',
    };
    this.getCallingUser = this.getCallingUser.bind(this);
    this.toggleChatWindow = this.toggleChatWindow.bind(this);
    this.forceCloseChatWindow = this.forceCloseChatWindow.bind(this);
    this.joinConnectionRoom = this.joinConnectionRoom.bind(this);
    this.leaveConnectionRoom = this.leaveConnectionRoom.bind(this);
    this.getTargetUser = this.getTargetUser.bind(this);

    // Binding socket event listeners:
    socket.on('connection_user_entered', (room) => {
      console.log(`You've joined a room: ${room}`);
      this.setState({ room: room });
    });
  }

  UNSAFE_componentWillMount() {
    this.getTargetUser();
    this.getCallingUser();
  }

  getTargetUser() {
    this.setState({
      isLoading: true,
    });
    const currUserToken = Cookie.get('token');
    if (currUserToken) {
      axios
        .get(`${BASE_URL}/users/profile?token=${currUserToken}&user_id=${this.props.userID}`)
        .then((userProfile) => {
          // Now fetch the user's bio
          axios
            .get(`${BASE_URL}/users/bio?token=${currUserToken}&user_id=${this.props.userID}`)
            .then((userBio) => {
              this.setState({
                isLoading: false,
                fetchSucceeded: true,
                currentChatUser: userProfile.data,
                bio: userBio.data,
              });
              console.log(this.state.currentChatUser);
            })
            .catch((err) => {
              if (err.response) {
                this.setState({
                  isLoading: false,
                  fetchSucceeded: false,
                });
                errorNotification(err, "Couldn't view profile bio");
              } else {
                Notification.spawnNotification(
                  "Couldn't view profile bio",
                  'Something went wrong. Techsuite messed up!',
                  'danger'
                );
              }
            });
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
            fetchSucceeded: false,
          });
          errorNotification(err, "Couldn't view profile");
        });
    } else {
      this.setState({
        isLoading: false,
        fetchSucceeded: false,
      });
      Notification.spawnNotification('Failed', 'Please log in first', 'danger');
    }
  }

  getCallingUser() {
    // Fetch the current user's profile data
    const currToken = Cookie.get('token');
    const userID = Cookie.get('user_id');
    if (currToken) {
      axios
        .get(`${BASE_URL}/users/profile?token=${currToken}&user_id=${userID}`)
        .then((userPayload) => {
          this.setState({
            thisUser: userPayload.data,
            isLoading: false,
            fetchSucceeded: true,
          });
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
            fetchSucceeded: false,
          });
          errorNotification(err, 'Failed to load your details');
        });
    } else {
      Notification.spawnNotification("Can't load your details", 'Please log in first!', 'danger');
      this.setState({
        isLoading: false,
        fetchSucceeded: false,
      });
    }
  }

  toggleChatWindow(userID) {
    const currToken = Cookie.get('token');
    if (currToken) {
      axios
        .get(`${BASE_URL}/users/profile?token=${currToken}&user_id=${userID}`)
        .then((userPayload) => {
          this.setState({
            currentChatUser: userPayload.data,
            chatWindowOpen: !this.state.chatWindowOpen,
          });
          if (this.state.chatWindowOpen) {
            this.joinConnectionRoom();
          } else {
            this.leaveConnectionRoom();
          }
        })
        .catch((err) => {
          errorNotification(err, 'Failed to fetch user profile');
        });
    }
  }

  leaveConnectionRoom() {
    const { room } = this.state;
    const currToken = Cookie.get('token');
    if (currToken) {
      socket.emit('connection_user_leave', { token: currToken, room: room });
    }
  }

  joinConnectionRoom() {
    const currToken = Cookie.get('token');
    const userID = this.state.currentChatUser.user_id;
    if (currToken) {
      socket.emit('connection_user_enter', { token: currToken, user_id: userID });
    }
  }

  forceCloseChatWindow() {
    this.setState({
      chatWindowOpen: false,
    });
  }

  render() {
    const { currentChatUser, thisUser, room } = this.state;
    const { user_id, email, username, profile_img_url } = currentChatUser;
    const { first_name, last_name, cover_img_url, summary, location, title, education } = this.state.bio;
    console.log(currentChatUser);
    const coverStyle = {
      backgroundImage:
        cover_img_url != null
          ? `url('${cover_img_url}')`
          : `url(https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80)`,
      backgroundSize: 'cover',
    };
    return (
      <div>
        {this.state.isLoading ? (
          <LoadingSpinner />
        ) : this.state.fetchSucceeded ? (
          <div>
            <div className="user-profile text-center" style={coverStyle}>
              <div className="user-profile-card">
                <div className="m-b">
                  <img src={profile_img_url} className="user-profile-image b-circle" alt="Profile" />
                </div>
                <div>
                  <h2 className="h4">
                    <strong>{`${username}`}</strong>
                  </h2>

                  <BioField
                    field="Name"
                    value={first_name != null || last_name != null ? first_name + ' ' + last_name : ''}
                  />
                  <BioField field="Title" value={'💼 ' + (title != null ? title : 'Software Engineer')} />
                  <BioField field="Education" value={'🎓 ' + (education != null ? education : 'Unknown education')} />
                  <BioField field="Location" value={'� ' + (location != null ? location : '️Unknown location')} />
                  <BioField field="Email" value={'📧 ' + email} />
                </div>
                {currentChatUser.user_id ? (
                  parseInt(user_id) === parseInt(Cookie.get('user_id')) ? (
                    <></>
                  ) : (
                    <ConnectButton {...this.props} {...this.state} openMessage={this.toggleChatWindow} />
                  )
                ) : (
                  <></>
                )}
              </div>
            </div>
            <ContentContainer>
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
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
                        <UserChannels userID={this.props.userID} />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </motion.div>
            </ContentContainer>
          </div>
        ) : (
          <></>
        )}

        {this.state.chatWindowOpen ? (
          <ConnectionChat.Container>
            <ConnectionChat.ChatBox
              name="Messages"
              status="online"
              close={this.forceCloseChatWindow}
              otherUser={currentChatUser}
              thisUser={thisUser}
              socket={socket}
              room={room}
            />
          </ConnectionChat.Container>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default UserProfile;
