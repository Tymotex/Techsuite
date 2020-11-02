import React, { Component } from 'react';
import UserProfileEditForm from '../../components/user-profile/UserProfileEditForm';

class ProfileEdit extends Component {
	render() {
		return (
			<div>
				<UserProfileEditForm userID={parseInt(this.props.match.params.userID)} />
			</div>
		);
	}
}

export default ProfileEdit;
