import React from 'react';
import './BioEditForm.scss';

class UserBio extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { summary } = this.props;
        return (
            <div>
                <h3>User Bio</h3>
                <div className="title-hr">
                    <hr />
                </div>
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
