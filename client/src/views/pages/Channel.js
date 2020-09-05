import React from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { BASE_URL } from '../../constants/api-routes';
import { Row, Col, Card, CardHeader, CardBody, Container, Button, Form, Input } from 'reactstrap';
import { ChannelMessages } from '../../components/channel-messages';
import { UserInvite } from '../../components/user-invite';
import { ChannelLeave } from '../../components/channel-leave';
import { ChannelEdit } from '../../components/channel-edit';
import { ChannelUploadImage } from '../../components/channel-upload-image';
import { ChannelDetails } from '../../components/channel-details';
import { ChannelUploadCover } from '../../components/channel-upload-cover';
import { ChannelSearchMessages } from '../../components/channel-search-messages';
import { Notification } from '../../components/notification';
import { UserAddOwner } from '../../components/user-add-owner';
import { UserRemoveOwner } from '../../components/user-remove-owner';
import { LoadingSpinner } from '../../components/loading-spinner';

class Channel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            channel: {}
        };
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
                                    <CardBody>
                                        <ChannelDetails />
                                    </CardBody>
                                </Card>
                                <hr />
                            </Col>
                            <Col md={12} xl={8}>
                                {/* Message log and form */}
                                <Card>
                                    <CardBody>
                                        <ChannelMessages channelID={this.props.match.params.channelID} />
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md={12} xl={4}>
                                <Card>
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
                                <Card>
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
