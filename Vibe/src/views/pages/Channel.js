import React from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUser } from '@fortawesome/free-solid-svg-icons';
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
import { ChannelMessages } from '../../components/channel-messages';

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
        const currUserID = Cookie.get("user_id");
        return (
            (this.state.isLoading) ?
                <p>LOADING</p> :
                (this.state.fetchSucceeded) ?
                    <div>
                        <Row>
                            <Col md={8}>
                                {/* Header card */}
                                <Card>
                                    <CardBody>
                                        <h1>{name}</h1>
                                        <p className="text-muted">
                                            {description}
                                        </p>
                                        <h3>Owners:</h3>
                                        <ul>
                                            {owner_members.map((eachMember, i) => (
                                                <li key={i}>
                                                    <FontAwesomeIcon icon={faStar} />  {eachMember.name_first} {eachMember.name_last}
                                                    {(currUserID === eachMember.u_id) ? 
                                                        <span> (You)</span>:
                                                        ""
                                                    }
                                                </li>
                                            ))}
                                        </ul>
                                        <h3>All Members:</h3>
                                        <ul>
                                            {all_members.map((eachMember, i) => {
                                                    let isOwner = false;
                                                    owner_members.forEach((owner) => {
                                                        if (owner.u_id === eachMember.u_id) {
                                                            isOwner = true;
                                                        }
                                                    });
                                                    return (
                                                        <li key={i}>
                                                            {(isOwner) ?
                                                                <FontAwesomeIcon icon={faStar} /> :
                                                                <FontAwesomeIcon icon={faUser} />
                                                            } {eachMember.name_first} {eachMember.name_last}
                                                            {(currUserID === eachMember.u_id) ? 
                                                                <span> (You)</span>:
                                                                ""
                                                            }
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                    </CardBody>
                                </Card>
                                <hr />
                                {/* Message log and form */}
                                <Card>
                                    <CardBody>
                                        <ChannelMessages />
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
                                <Card>
                                    <CardHeader>Invite Someone</CardHeader>
                                    <CardBody>
                                        <Form>
                                            <FormGroup>
                                                <Label for="exampleSelectMulti">Select Multiple</Label>
                                                <Input type="select" name="selectMulti" id="exampleSelectMulti" multiple>
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                    <option>5</option>
                                                </Input>
                                                <Button>Invite</Button>
                                            </FormGroup>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div> :
                    <p>FETCH FAILED. Is the backend running?</p>
        )
    }
}

export default Channel;
