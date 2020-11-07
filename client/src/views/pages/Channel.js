import axios from 'axios';
import Cookie from 'js-cookie';
import React from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import io from 'socket.io-client';
import { ChannelDetails } from '../../components/channel-details';
import { ChannelEdit } from '../../components/channel-edit';
import { ChannelLeave } from '../../components/channel-leave';
import { ChannelMessages } from '../../components/channel-messages';
import { ChannelSearchMessages } from '../../components/channel-search-messages';
import { ChannelUploadCover } from '../../components/channel-upload-cover';
import { ChannelUploadImage } from '../../components/channel-upload-image';
import { LoadingSpinner } from '../../components/loading-spinner';
import { Notification } from '../../components/notification';
import { UserAddOwner } from '../../components/user-add-owner';
import { UserInvite } from '../../components/user-invite';
import { UserRemoveOwner } from '../../components/user-remove-owner';
import { BASE_URL, SOCKET_URI } from '../../constants/api-routes';


const socket = io(SOCKET_URI);

class Channel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            channel: {}
        };
        socket.on("user_entered", (message) => {
            console.log(message);
        });
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        });
        const currUserToken = Cookie.get("token");
        if (currUserToken) {
            axios.get(`${BASE_URL}/channels/details?token=${currUserToken}&channel_id=${this.props.match.params.channelID}`)
                .then((allChannels) => {
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: true,
                        channel: allChannels.data
                    });
                })
                .catch((err) => {
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Viewing channel failed", errorMessage, "danger");
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: false
                    });
                });
        } else {
            Notification.spawnNotification("Can't load channels", "Please log in first", "danger");
            this.setState({
                isLoading: false,
                fetchSucceeded: false
            });
        }
    }

    render() {
        const cardHeaderStyle = {
            "textAlign": "center",
            "fontSize": "150%"
        };
        const cardBodyStyle = {
            "padding": "5px",
            "border-radius": "0%",
            "box-shadow": "2px 2px 10px 0px rgba(0,0,0,0.3)"
        }
    
        return (
            <div>
                {(this.state.isLoading) ? (
                    <LoadingSpinner /> 
                ) : (
                    (this.state.fetchSucceeded) ? (
                        <Row>
                            <Col md={12}>
                                {/* Header card */}
                                <Card>
                                    <CardBody style={cardBodyStyle}>
                                        <ChannelDetails />
                                    </CardBody>
                                </Card>
                                <hr />
                            </Col>
                            <Col lg={12} xl={4}>
                                <Card style={cardBodyStyle}>
                                    <CardHeader style={cardHeaderStyle}>Channel Functions</CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col md={6}>
                                                <UserInvite /> 
                                            </Col>
                                            <Col md={6}>
                                                <ChannelLeave />
                                            </Col>
                                        </Row>
                                        <br />
                                        <Row>
                                            <Col md={6}>
                                                <ChannelUploadImage />
                                            </Col>
                                            <Col md={6}>
                                                <ChannelUploadCover />
                                            </Col>
                                        </Row>
                                        <br />
                                        <Row>
                                            <Col md={6}>
                                                <ChannelEdit />
                                            </Col>
                                            <Col md={6}>
                                                <ChannelSearchMessages />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card style={cardBodyStyle}>
                                    <CardHeader style={cardHeaderStyle}>Modify Users</CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col md={6}>
                                                <UserAddOwner /> 
                                            </Col>
                                            <Col md={6}>
                                                <UserRemoveOwner />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg={12} xl={8}>
                                {/* Message log and form */}
                                <Card style={cardBodyStyle}>
                                    <CardBody>
                                        <ChannelMessages channelID={this.props.match.params.channelID} />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    ) : (
                        <></>
                    )
                )}
            </div>
        )
    }
}

export default Channel;
