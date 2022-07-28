import React, { Component } from 'react';
import ContentContainer from '../../components/container/ContentContainer';
import UserProfileEditForm from '../../components/user-profile/UserProfileEditForm';

class ProfileEdit extends Component {
  render() {
    return (
      <ContentContainer>
        <UserProfileEditForm userID={parseInt(this.props.match.params.userID)} />
      </ContentContainer>
    );
  }
}

export default ProfileEdit;
