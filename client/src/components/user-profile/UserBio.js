import React from 'react';

class UserBio extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { summary } = this.props;
        return (
            <div>
                <h3>User Bio</h3>
                <p>
                    {summary != null ? summary : "No bio has been set"}
                </p>
            </div>
        );
    }
}

export default UserBio;
