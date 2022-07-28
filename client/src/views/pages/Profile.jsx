import React, { Component } from 'react';
import ContentContainer from '../../components/container/ContentContainer';
import { UserProfile } from '../../components/user-profile';

class Profile extends Component {
  render() {
    return (
      <ContentContainer>
        <UserProfile userID={parseInt(this.props.match.params.userID)} />
      </ContentContainer>
    );
  }
}

export default Profile;
