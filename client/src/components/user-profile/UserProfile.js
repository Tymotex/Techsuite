import React from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import { Row, Col, Card, Button } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';

class UserProfile extends React.Component {
    static propTypes = {
        userID: PropTypes.number.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            user: {}
        };
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        });
        const currUserToken = Cookie.get("token");
        if (currUserToken) {
            axios.get(`${BASE_URL}/users/profile?token=${currUserToken}&u_id=${this.props.userID}`)
                .then((userProfile) => {
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: true,
                        user: userProfile.data
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
        const { email, name_first, name_last, profile_img_url } = this.state.user;
        return (
            <Card body>
                <div className="text-center">
                    <div className="m-b">
                        <img src={profile_img_url} style={{ width: "200px", height: "200px" }} className="b-circle" alt="Profile" />
                    </div>
                    <div>
                        <h2 className="h4">{`${name_first} ${name_last}`}</h2>
                        <div className="h5 text-muted">Software Engineering Student</div>
                        <div className="h5 text-muted">{email}</div>
                        <hr />
                        <Row className="text-center m-b">
                            <Col>
                                <strong>10</strong>
                                <div className="text-muted">Channels owned</div>
                            </Col>
                            <Col>
                                <strong>20</strong>
                                <div className="text-muted">Channels joined</div>
                            </Col>
                        </Row>
                        <Button block>Follow</Button>
                    </div>
                </div>
            </Card>
        );
    }  
}

export default UserProfile;