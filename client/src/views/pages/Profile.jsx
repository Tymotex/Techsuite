import { Component } from 'react';
import { UserProfile } from '../../components/user-profile';

class Profile extends Component {
  render() {
    return <UserProfile userID={parseInt(this.props.match.params.userID)} />;
  }
}

export default Profile;
