import React from 'react';
import ChannelUser from './ChannelUser';

class ChannelMemberList extends React.Component {
    render() {
        const { members, owners } = this.props;
        return (
            <div className="chat-user-list" style={{overflow: "auto", outline: "none"}} tabIndex="5000">
                <div className="chat-users">
                    {members.map((eachMember, i) => {
                        let isOwner = false;
                        owners.forEach((owner) => {
                            if (parseInt(owner.user_id, 10) === parseInt(eachMember.user_id, 10)) {
                                isOwner = true;
                            }
                        });
                        return (
                            <ChannelUser key={i} member={eachMember} isOwner={isOwner}/>
                        );
                    }
                    )}
                </div>
            </div>
        );
    }
}

export default ChannelMemberList;
