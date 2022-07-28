import axios from 'axios';
import Cookie from 'js-cookie';
import React from 'react';
import { ChannelList } from '../../components/channel-list';
import { errorNotification } from '../../components/error-notification';
import { LoadingSpinner } from '../../components/loading-spinner';
import { Notification } from '../../components/notification';
import { BASE_URL } from '../../constants/api-routes';
import Empty from './Empty';
import { motion } from 'framer-motion';
import ContentContainer from '../../components/container/ContentContainer';

class ChannelsAll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      fetchSucceeded: false,
      allChannels: [],
      myChannels: [],
      showAll: true,
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
          errorNotification(err, 'Viewing all channels failed');
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
      <ContentContainer>
        <h1>Channels</h1>
        <p style={{ paddingLeft: '6px', margin: '20px 0px' }}>
          Meet new developers, grow your ideas and debate controversial topics 😉.
        </p>
        {this.state.isLoading ? (
          <LoadingSpinner />
        ) : !this.state.fetchSucceeded ? (
          <Empty />
        ) : (
          <>
            <aside style={{ paddingLeft: '6px', textAlign: 'center', color: 'grey', margin: '20px 0' }}>
              Showing {this.state.allChannels && this.state.allChannels.length} channel
              {this.state.allChannels && this.state.allChannels.length !== 1 && 's'}.
            </aside>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
              <ChannelList {...this.state} showPrompt={true} />
            </motion.div>
          </>
        )}
      </ContentContainer>
    );
  }
}

export default ChannelsAll;
