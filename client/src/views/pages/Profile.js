import React, { Component } from 'react';
import { UserProfile } from '../../components/user-profile';
import UserProfileEditForm from '../../components/user-profile/UserProfileEditForm';

class Profile extends Component {
	render() {
		return (
			<div>
				<UserProfile userID={parseInt(this.props.match.params.userID)} />
				<UserProfileEditForm userID={parseInt(this.props.match.params.userID)} />
			</div>
		);
	}
}

export default Profile;
