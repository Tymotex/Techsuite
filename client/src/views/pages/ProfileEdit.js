import React, { Component } from 'react';
import { UserProfile } from '../../components/user-profile';
import UserProfileEditForm from '../../components/user-profile/UserProfileEditForm';

class ProfileEdit extends Component {
	render() {
		return (
			<div>
				<UserProfile userID={this.props.match.params.userID} />
				<hr />
				<UserProfileEditForm userID={parseInt(this.props.match.params.userID)} />
			</div>
		);
	}
}

export default ProfileEdit;
