import axios from 'axios';
import Cookie from 'js-cookie';
import React, { Component } from 'react';
import { ChannelList } from '../../components/channel-list';
import { errorNotification } from '../../components/error-notification';
import { LoadingSpinner } from '../../components/loading-spinner';
import { Notification } from '../../components/notification';
import { BASE_URL } from '../../constants/api-routes';
import Empty from './Empty';
import { motion } from 'framer-motion';

class ChannelsMy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      fetchSucceeded: false,
      allChannels: [],
      myChannels: [],
      showAll: false,
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    const currUserToken = Cookie.get('token');
    if (currUserToken) {
      axios
        .get(`${BASE_URL}/channels/listall?token=${currUserToken}`)
        .then((allChannels) => {
          this.setState({
            isLoading: false,
            fetchSucceeded: true,
            allChannels: allChannels.data.channels,
            myChannels: allChannels.data.channels.filter((eachChannel) => eachChannel.member_of),
          });
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
            fetchSucceeded: false,
          });
          errorNotification(err, "Couldn't list all channels");
        });
    } else {
      Notification.spawnNotification("Can't load your channels", 'Please log in first', 'danger');
      this.setState({
        isLoading: false,
        fetchSucceeded: false,
      });
    }
  }

  render() {
    return (
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        {this.state.myChannels && this.state.myChannels.length > 0 && (
          <>
            <h1>Your Channels</h1>
            <p style={{ paddingLeft: '6px', margin: '20px 0px' }}>
              You've joined {this.state.myChannels && this.state.myChannels.length} channel
              {this.state.myChannels && this.state.myChannels.length !== 1 && 's'}. Here they are!
            </p>
          </>
        )}
        {this.state.isLoading ? (
          <LoadingSpinner />
        ) : this.state.fetchSucceeded ? (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <ChannelList {...this.state} showPrompt={true} />
          </motion.div>
        ) : (
          <Empty />
        )}
      </div>
    );
  }
}

export default ChannelsMy;
