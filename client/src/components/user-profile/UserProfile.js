import axios from 'axios';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import React from 'react';
import { Card, Col, Row, CardBody } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import "./UserProfile.scss";
import UserChannels from './UserChannels'; 
import UserBio from './UserBio';

class UserProfile extends React.Component {
    static propTypes = {
        userID: PropTypes.number.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            user: {},
            bio: {}
        };
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
                                user: userProfile.data,
                                bio: userBio.data
                            });
                        })
                        .catch((err) => {
                            this.setState({
                                isLoading: false,
                                fetchSucceeded: false
                            })
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
        const { email, username, profile_img_url } = this.state.user;
        const { first_name, last_name, cover_img_url, summary, location, title, education} = this.state.bio;

        console.log(this.state.bio);

        const coverStyle = {
            "background-image": cover_img_url != null ? `url('${cover_img_url}')` : `linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 45%, rgba(0,212,255,1) 100%)`, 
            "background-size": "cover"
        }

        return (
            <>
                <Card body>
                    <div className="user-profile text-center" style={coverStyle}>
                        <div className="user-profile-card">
                            <div className="m-b">
                                <img src={profile_img_url} style={{ width: "200px", height: "200px" }} className="b-circle" alt="Profile" />
                            </div>
                            <div>
                                <h2 className="h4"><strong>{`${username}`}</strong></h2>
                                <div className="user-profile-card-divider">
                                    <hr />
                                </div>
                                <div className="h5 text-muted">Name: {(first_name != null || last_name != null) ? first_name + " " + last_name : "not specified"}</div>
                                <div className="h5 text-muted">Title: {title != null ? title : "unknown"}</div>
                                <div className="h5 text-muted">Education: {education != null ? education : "unknown"}</div>
                                <div className="h5 text-muted">Location: {location != null ? location : "unknown"}</div>
                                <div className="h5 text-muted">Email: {email}</div>
                                
                            </div>
                        </div>
                    </div>
                </Card>
                <Row>
                    <Col xs={4}>
                        <Card>
                            <CardBody>
                                <UserBio summary={summary} />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs={8}>
                        <Card>
                            <CardBody>
                                <UserChannels />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }  
}

export default UserProfile;
