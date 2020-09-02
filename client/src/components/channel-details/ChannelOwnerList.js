import React from 'react';
import ChannelUser from './ChannelUser';

class ChannelOwnerList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { owners } = this.props;
        return (
            <div class="chat-user-list" style={{overflow: "auto", outline: "none"}} tabindex="5000">
                <div class="chat-users">
                    {owners.map((eachMember, i) => (
                        <ChannelUser member={eachMember} isOwner={true} />
                    ))}
                </div>
            </div>
        );
    }
}

export default ChannelOwnerList;
