import React from 'react';
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

const Channel = (props) => {
    const cardHeaderStyle = {
        "textAlign": "center",
        "fontSize": "150%"
    };

    return (
        <div>
            <Notification />
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
                            <ChannelMessages channelID={props.match.params.channelID} />
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
        </div>
    )
}

export default Channel;
