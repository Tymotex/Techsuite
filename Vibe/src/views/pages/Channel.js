import React from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { BASE_URL } from '../../constants/api-routes';
import {
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    Button
} from 'reactstrap';

class Channel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            channel: {}
        }
    }

    componentWillMount() {
        this.setState({
            isLoading: true
        });
        const currUserToken = Cookie.get("token");
        if (currUserToken) {
            axios.get(`${BASE_URL}/channels/details?token=${currUserToken}&channel_id=${this.props.match.params.channelID}`)
                .then((res) => {
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: true,
                        channel: res.data
                    });
                })
                .catch((err) => {
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: false
                    })
                })
        } else {
            // TODO: how should this case be handled?
            alert("TOKEN WAS NOT FOUND IN COOKIE");
        }
    }

    render() {
        const centerChildren = {
            width: "100%",
            textAlign: "center"
        };
        const chatDivider = {
            width: "97%",
            display: "inline-block",
            margin: "2px"
        };

        const { name, description, all_members, owner_members } = this.state.channel;
        console.log(this.state.channel);
        return (
            <div>
                <Row>
                    <Col md={8}>
                        {/* Header card */}
                        <Card>
                            <CardBody>
                                <h1>{name}</h1>
                                <p className="text-muted">
                                    {this.props.match.params.channelID}.
                                    {description}
                                </p>
                            </CardBody>
                        </Card>
                        <hr />
                        {/* Message log and form */}
                        <Card>
                            <CardBody>
                                FETCH MESSAGES AND DISPLAY THEM HERE. Style them with styles and format similar to Facebook messenger
                            </CardBody>

                            {/* Divider */}
                            <Container style={centerChildren}>
                                <hr style={chatDivider} />
                            </Container>
                            {/* Form */}
                            <CardBody>
                                <Form>
                                    <FormGroup>
                                        <Label for="message-send-textarea">Send a message:</Label>
                                        <Input type="textarea" name="message" id="message-send-textarea" />
                                    </FormGroup>
                                    <Button>Send</Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <CardHeader>Side Widgets here?</CardHeader>
                            <CardBody>
                                <h2>{this.props.match.params.channelName}</h2>
                                Maybe something that can track stats relevant to this channel.
                                Maybe a meme generator, an image editor, or some other useful utility.
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Channel;
