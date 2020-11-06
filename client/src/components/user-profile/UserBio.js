import React from 'react';
import './BioEditForm.scss';

class UserBio extends React.Component {
    render() {
        const { summary } = this.props;
        return (
            <div>
                <h3>User Bio</h3>
                <hr className="user-profile-card-divider" />
                <em>
                    <p>
                        {summary != null ? summary : "No bio has been set"}
                    </p>
                </em>
            </div>
        );
    }
}

export default UserBio;
