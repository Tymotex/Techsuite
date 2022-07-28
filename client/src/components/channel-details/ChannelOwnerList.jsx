import React from 'react';
import ChannelUser from './ChannelUser';

class ChannelOwnerList extends React.Component {
    render() {
        const { owners } = this.props;
        return (
            <div className="chat-user-list" style={{overflow: "auto", outline: "none"}} tabIndex="5000">
                <div className="chat-users">
                    {owners.map((eachMember, i) => (
                        <ChannelUser key={i} member={eachMember} isOwner={true} />
                    ))}
                </div>
            </div>
        );
    }
}

export default ChannelOwnerList;
