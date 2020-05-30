import React from 'react';
import { Row, Col, Card, CardHeader, CardBody, Container, Button, Form, Input } from 'reactstrap';
import { ChannelMessages } from '../../components/channel-messages';
import { UserInvite } from '../../components/user-invite';
import { ChannelLeave } from '../../components/channel-leave';
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
                <Col md={12} xl={10}>
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

                        {/* Divider */}
                        <Container style={centerChildren}>
                            <hr style={chatDivider} />
                        </Container>
                        {/* Form */}
                        <CardBody>
                            Something could go here? Maybe something important like a meeting summary?
                        </CardBody>
                    </Card>
                </Col>
                <Col md={12} xl={2}>
                    <Card>
                        <CardHeader>Side Widgets here?</CardHeader>
                        <CardBody>
                            Maybe something that can track stats relevant to this channel.
                            Maybe a meme generator, an image editor, or some other useful utility.
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>Channel Functions</CardHeader>
                        <CardBody>
                            <UserInvite /> <ChannelLeave />
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>Search Channel Messages</CardHeader>
                        <Form className="form-inline">
                            <Input className="form-control" type="search" placeholder="Search" aria-label="Search" />
                            <Button type="submit">
                                <i className="fa fa-search" />
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Channel;
