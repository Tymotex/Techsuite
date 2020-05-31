import React, { Component } from 'react';
import { UserProfile } from '../../components/user-profile';
import { PictureForm } from '../../components/picture-form';

class Profile extends Component {
	render() {
		return (
			<div>
				<UserProfile userID={parseInt(this.props.match.params.userID)} />
				<PictureForm />
			</div>
		);
	}
}

export default Profile;
