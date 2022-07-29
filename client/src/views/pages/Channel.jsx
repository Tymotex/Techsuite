import axios from 'axios';
import Cookie from 'js-cookie';
import React from 'react';
import io from 'socket.io-client';
import { ChannelDetails } from '../../components/channel-details';
import { ChannelEdit } from '../../components/channel-edit';
import { ChannelLeave } from '../../components/channel-leave';
import { ChannelMessages } from '../../components/channel-messages';
import { ChannelSearchMessages } from '../../components/channel-search-messages';
import { ChannelUploadCover } from '../../components/channel-upload-cover';
import { ChannelUploadImage } from '../../components/channel-upload-image';
import ContentContainer from '../../components/container/ContentContainer';
import { errorNotification } from '../../components/error-notification';
import { LoadingSpinner } from '../../components/loading-spinner';
import { Notification } from '../../components/notification';
import { UserAddOwner } from '../../components/user-add-owner';
import { UserInvite } from '../../components/user-invite';
import { UserRemoveOwner } from '../../components/user-remove-owner';
import { BASE_URL, SOCKET_URI } from '../../constants/api-routes';

const socket = io(SOCKET_URI);

class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      fetchSucceeded: false,
      channel: {},
    };
    socket.on('user_entered', (message) => {
      console.log(message);
    });
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    const currUserToken = Cookie.get('token');
    if (currUserToken) {
      axios
        .get(`${BASE_URL}/channels/details?token=${currUserToken}&channel_id=${this.props.match.params.channelID}`)
        .then((allChannels) => {
          this.setState({
            isLoading: false,
            fetchSucceeded: true,
            channel: allChannels.data,
          });
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
            fetchSucceeded: false,
          });
          errorNotification(err, 'Viewing channel failed');
        });
    } else {
      Notification.spawnNotification("Can't load channels", 'Please log in first', 'danger');
      this.setState({
        isLoading: false,
        fetchSucceeded: false,
      });
    }
  }

  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <LoadingSpinner />
        ) : this.state.fetchSucceeded ? (
          <>
            <ChannelDetails />
            <ContentContainer>
              {/* Channel functions */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  columnGap: '4px',
                  boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                  padding: '12px',
                  borderRadius: '10px',
                  justifyContent: 'space-between',
                  background: 'white',
                }}
              >
                <div style={{ display: 'inline-flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                  <UserInvite />
                  <ChannelLeave />
                  <ChannelEdit />
                  <ChannelSearchMessages />
                  <ChannelUploadImage />
                  <ChannelUploadCover />
                </div>
                <div style={{ display: 'inline-flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                  <UserAddOwner />
                  <UserRemoveOwner />
                </div>
              </div>

              {/* Message log and form */}
              <ChannelMessages channelID={this.props.match.params.channelID} />
            </ContentContainer>
          </>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default Channel;
