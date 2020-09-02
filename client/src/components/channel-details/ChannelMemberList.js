import { faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Cookie from 'js-cookie';
import ChannelUser from './ChannelUser';

class ChannelMemberList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { members, owners } = this.props;
        const currUserID = Cookie.get("user_id");
        return (
            <div class="chat-user-list" style={{overflow: "auto", outline: "none"}} tabindex="5000">
                <div class="chat-users">
                    {members.map((eachMember, i) => {
                        let isOwner = false;
                        owners.forEach((owner) => {
                            if (parseInt(owner.user_id, 10) === parseInt(eachMember.user_id, 10)) {
                                isOwner = true;
                            }
                        });
                        return (
                            <ChannelUser member={eachMember} isOwner={isOwner}/>
                        );
                    }
                    )}
                </div>
            </div>
        );
    }
}

export default ChannelMemberList;
