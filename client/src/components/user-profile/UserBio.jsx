import React from 'react';
import './BioEditForm.scss';

class UserBio extends React.Component {
  render() {
    const { summary } = this.props;
    return (
      <div>
        <h3>User Bio</h3>
        <hr className="user-profile-card-divider" />
        <p className={'text-muted'} style={{ marginTop: '24px' }}>
          {summary != null ? summary : '🕵️ This user likes to keep an air of mystery about them.'}
        </p>
      </div>
    );
  }
}

export default UserBio;
