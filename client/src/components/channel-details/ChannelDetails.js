import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Cookie from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import { BASE_URL } from '../../constants/api-routes';
import { LoadingSpinner } from '../loading-spinner';
import { Jumbotron, Row, Col } from 'reactstrap';
import './ChannelDetails.scss';
import ChannelMemberList from "./ChannelMemberList";
import ChannelOwnerList from './ChannelOwnerList';

class ChannelDetails extends React.Component {
    static propTypes = {
        match: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            channel: {}
        };
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
                    console.log("CHANNEL DETAILS: ");
                    console.log(this.state.channel);
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
        const { name, description, channel_img_url, all_members, owner_members } = this.state.channel;
        const currUserID = Cookie.get("user_id");
        return (
            (this.state.isLoading) ?
                <LoadingSpinner /> :
                (!this.state.fetchSucceeded) ?
                    <p>Fetch failed. Is the backend running?</p> :
                    <Jumbotron className="channel-header-jumbotron">
                        <div className="channel-card">
                            <img className="channel-image" src={channel_img_url} />
                            <h1 className="channel-name display-3">{name}</h1>
                            <p className="channel-description lead">{description}</p>
                            <hr className="channel-divider" />
                            <br />
                            <Row>
                                <Col md={6}>
                                    <h3 className="secondary-title">Members:</h3>
                                    <ChannelMemberList members={all_members} owners={owner_members} />
                                </Col>
                                <Col md={6}>
                                    <h3 className="secondary-title">Owners:</h3>
                                    <ChannelOwnerList owners={owner_members} />
                                </Col>
                            </Row>
                        </div>
                    </Jumbotron>
        );
    }
}

export default withRouter(ChannelDetails);
