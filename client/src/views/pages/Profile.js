import React, { Component } from 'react';
import { UserProfile } from '../../components/user-profile';
import { Notification } from '../../components/notification';

class Profile extends Component {
	render() {
		return (
			<div>
				<Notification />
				<UserProfile userID={parseInt(this.props.match.params.userID)} />
			</div>
		);
	}
}

export default Profile;
