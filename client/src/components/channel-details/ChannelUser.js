import { faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import Cookie from 'js-cookie';
import './ChannelUser.scss'

class ChannelUser extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { member, isOwner } = this.props;
        const currUserID = Cookie.get("user_id");
        return (
            <Link to={`/user/profile/${member.user_id}`} className="link">    
                <div class="user">
                    <div class="avatar">
                        <img src={member.profile_img_url} alt={member.username} />
                    </div>
                    <div class="name">
                        {(isOwner) ?
                            <FontAwesomeIcon icon={faStar} /> :
                            <FontAwesomeIcon icon={faUser} />
                        } 
                        {" " + member.username}
                        {(parseInt(currUserID, 10) === parseInt(member.user_id, 10)) ?
                            <span> (You)</span> :
                            <span></span>
                        }    
                    </div>
                    <div class="mood">{member.email}</div>
                </div>
            </Link>
        );
    }
}

export default ChannelUser;
