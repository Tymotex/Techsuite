import React, { Component } from 'react';
import ContentContainer from '../../components/container/ContentContainer';
import { UserProfile } from '../../components/user-profile';

class Profile extends Component {
  render() {
    return <UserProfile userID={parseInt(this.props.match.params.userID)} />;
  }
}

export default Profile;
