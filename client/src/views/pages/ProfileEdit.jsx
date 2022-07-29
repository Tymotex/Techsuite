import { Component } from 'react';
import UserProfileEditForm from '../../components/user-profile/UserProfileEditForm';

class ProfileEdit extends Component {
  render() {
    return <UserProfileEditForm userID={parseInt(this.props.match.params.userID)} />;
  }
}

export default ProfileEdit;
