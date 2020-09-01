import React from 'react';
import { Row, Col, Card, CardHeader, CardBody, Container, Button, Form, Input } from 'reactstrap';
import { ChannelMessages } from '../../components/channel-messages';
import { UserInvite } from '../../components/user-invite';
import { ChannelLeave } from '../../components/channel-leave';
import { ChannelEdit } from '../../components/channel-edit';
import { ChannelUploadImage } from '../../components/channel-upload-image';
import { ChannelDetails } from '../../components/channel-details';

const Channel = (props) => {
    const centerChildren = {
        width: "100%",
        textAlign: "center"
    };
    const chatDivider = {
        width: "97%",
        display: "inline-block",
        margin: "2px"
    };

    return (
        <div>
            <Row>
                <Col md={12} xl={8}>
                    {/* Header card */}
                    <Card>
                        <CardBody>
                            <ChannelDetails />
                        </CardBody>
                    </Card>
                    <hr />
                    {/* Message log and form */}
                    <Card>
                        <CardBody>
                            <ChannelMessages channelID={props.match.params.channelID} />
                        </CardBody>
                    </Card>
                </Col>
                <Col md={12} xl={4}>
                    <Card>
                        <CardHeader style={{"text-align": "center"}}>Channel Functions</CardHeader>
                        <CardBody>
                            <Row>
                                <Col lg={12} xl={6}>
                                    <UserInvite /> 
                                </Col>
                                <Col lg={12} xl={6}>
                                    <ChannelLeave />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col lg={12} xl={6}>
                                    <ChannelEdit />
                                </Col>
                                <Col lg={12} xl={6}>
                                    <ChannelUploadImage />
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
