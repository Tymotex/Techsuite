import { faLock, faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { Notification } from '../notification';
import './Channel.scss';

class Channel extends React.Component { 
    constructor(props) {
        super(props);
        this.joinChannel = this.joinChannel.bind(this);
    }

    joinChannel() {
        const currToken = Cookie.get("token");
        if (currToken) {
            axios({
                    url: `${BASE_URL}/channels/join`,
                    method: "POST",
                    data: {
                        token: currToken,
                        channel_id: this.props.channel_id
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then((res) => {
                    console.log("Successfully joined channel!");
                    this.props.history.push(`/channel/${this.props.channel_id}`);
                })
                .catch((err) => {
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Joining channel failed", errorMessage, "danger");
                });
        } else {
            this.setState({
                isLoading: false,
                fetchSucceeded: false
            });
            Notification.spawnNotification("Failed", "Please log in first", "danger");
        }
    }

    render() {
        const { channel_id, name, channel_img_url, description, visibility, member_of, owner_of } = this.props;
        return (
            <Card className="channel-card">
                <CardBody>
                    <Row>
                        <Col lg={12} xl={4} className="channel-picture-section">
                            <div class="frame">
                                <span class="helper"></span>
                                <Link to={`/channel/${channel_id}`} style={{ textDecoration: 'none' }}>
                                    <img
                                        className="channel-picture"
                                        src={channel_img_url}
                                        alt="Responsive"
                                        aria-hidden={true}
                                    />
                                </Link>
                            </div>
                        </Col>
                        <Col lg={12} xl={8} style={{"padding": "10px",}}>
                            
                                <Link className="channel-title" to={`/channel/${channel_id}`}>
                                    <h4 className="h4">{name}</h4>
                                </Link>
                                <p className="text-muted">
                                    {description}
                                </p>
                                {(visibility === "public") ? 
                                    <em>Public Channel</em> :
                                    <em>Private Channel  <FontAwesomeIcon icon={faLock} /></em>
                                }
                                {/* Showing the button to join/request invite, if the user is NOT an owner/member */}
                                {(!owner_of && !member_of) ?
                                    (visibility === "public") ? (
                                        <div>
                                            <Button onClick={this.joinChannel}>Join Channel</Button> 
                                        </div>
                                    ) : 
                                        <></> :
                                    ""
                                }
                                {(owner_of) ?
                                    <p><FontAwesomeIcon icon={faStar} /> You are an owner</p>:
                                    (member_of) ? 
                                        <em><p><FontAwesomeIcon icon={faUser} /> You are a member</p></em> :
                                        <em><p>You are not a member</p></em>
                                }
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        );
    }
}

Channel.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    channel_img_url: PropTypes.string,
    isPublic: PropTypes.bool
};

Channel.defaultProps = {
    name: "Unnamed",
    description: "This channel's creator didn't set a description",
    channel_img_url: "https://static.thenounproject.com/png/1088616-200.png",
    isPublic: true
};

export default withRouter(Channel);
