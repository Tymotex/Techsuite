import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Cookie from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import { BASE_URL } from '../../constants/api-routes';
import { LoadingSpinner } from '../loading-spinner';

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
        const { name, description, all_members, owner_members } = this.state.channel;
        const currUserID = Cookie.get("user_id");
        return (
            (this.state.isLoading) ?
                <LoadingSpinner /> :
                (!this.state.fetchSucceeded) ?
                    <p>Fetch failed. Is the backend running?</p> :
                    <>
                        <h1>{name}</h1>
                        <p className="text-muted">
                            {description}
                        </p>
                        <h3>Owners:</h3>
                        <div class="decor-default chat-user-list" style={{overflow: "auto", outline: "none"}} tabindex="5000">
                            <div class="chat-users">
                                {owner_members.map((eachMember, i) => (
                                    <div key={i} class="user">
                                        
                                        {(currUserID === eachMember.user_id) ?
                                            <span> (You)</span> :
                                            ""
                                        }
                                        <div class="avatar">
                                            <img src={eachMember.profile_img_url} alt={eachMember.username} />
                                        </div>
                                        <div class="name"><FontAwesomeIcon icon={faStar} />  {eachMember.username}</div>
                                        <div class="mood">{eachMember.email}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                            
                        <h3>Members:</h3>
                        <div class="decor-default chat-user-list" style={{overflow: "auto", outline: "none"}} tabindex="5000">
                            <div class="chat-users">
                                {all_members.map((eachMember, i) => {
                                    let isOwner = false;
                                    owner_members.forEach((owner) => {
                                        if (owner.user_id === eachMember.user_id) {
                                            isOwner = true;
                                        }
                                    });
                                    return (
                                        <div key={i} class="user">
                                             {eachMember.name_first} {eachMember.name_last}
                                            {(currUserID === eachMember.user_id) ?
                                                <span> (You)</span> :
                                                ""
                                            }
                                            <div class="avatar">
                                                <img src={eachMember.profile_img_url} alt={eachMember.username} />
                                            </div>
                                            <div class="name">
                                                {(isOwner) ?
                                                    <FontAwesomeIcon icon={faStar} /> :
                                                    <FontAwesomeIcon icon={faUser} />
                                                }  {eachMember.username}
                                            </div>
                                            <div class="mood">{eachMember.email}</div>
                                        </div>
                                    );
                                }
                                )}
                            </div>
                        </div>
                    </>
        );
    }
}

export default withRouter(ChannelDetails);
