import React, { Component } from 'react';
import { UserProfile } from '../../components/user-profile';

class ProfileEdit extends Component {
	render() {
		return (
			<div>
                <h1>EDIT PROFILE</h1>
				<UserProfile userID={this.props.match.params.userID} />
			</div>
		);
	}
}

export default ProfileEdit;
