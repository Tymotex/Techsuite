import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Jumbotron, Row } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { BACKEND_DOWN_ERR_MESSAGE } from '../../constants/message';
import { EmptyFiller } from '../empty-filler';
import { errorNotification } from '../error-notification';
import { LoadingSpinner } from '../loading-spinner';
import { Notification } from '../notification';
import './ChannelDetails.scss';
import ChannelMemberList from './ChannelMemberList';
import ChannelOwnerList from './ChannelOwnerList';

class ChannelDetails extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      fetchSucceeded: false,
      channel: {},
    };
  }

  UNSAFE_componentWillMount() {
    this.setState({
      isLoading: true,
    });
    const currUserToken = Cookie.get('token');
    if (currUserToken) {
      axios
        .get(`${BASE_URL}/channels/details?token=${currUserToken}&channel_id=${this.props.match.params.channelID}`)
        .then((res) => {
          this.setState({
            isLoading: false,
            fetchSucceeded: true,
            channel: res.data,
          });
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
            fetchSucceeded: false,
          });
          errorNotification(err, 'Failed to fetch channel details');
        });
    } else {
      this.setState({
        isLoading: false,
        fetchSucceeded: false,
      });
      Notification.spawnNotification('Failed', 'Please log in first', 'danger');
    }
  }

  render() {
    const { name, description, visibility, channel_img_url, channel_cover_img_url, all_members, owner_members } =
      this.state.channel;
    const defaultCoverUrl =
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';

    return this.state.isLoading ? (
      <LoadingSpinner />
    ) : !this.state.fetchSucceeded ? (
      <EmptyFiller customMessage={BACKEND_DOWN_ERR_MESSAGE} />
    ) : (
      <Jumbotron
        className="channel-header-jumbotron"
        style={{
          backgroundImage:
            channel_cover_img_url != null ? `url('${channel_cover_img_url}')` : `url(${defaultCoverUrl})`,
        }}
      >
        <div className="channel-card">
          <img
            className="channel-image b-circle"
            src={channel_img_url}
            style={{ width: '200px', height: '200px' }}
            alt="Channel profile"
          />
          <h1 className="channel-name">
            {name + ' '}
            {visibility === 'public' ? <></> : <FontAwesomeIcon icon={faLock} />}
          </h1>
          <p className="channel-description lead">{description}</p>
          {/* <hr className="channel-divider" /> */}
          <br />
          <Row>
            <Col xs={12} xl={6}>
              <h3 className="secondary-title">Members</h3>
              <ChannelMemberList members={all_members} owners={owner_members} />
            </Col>
            <Col xs={12} xl={6}>
              <h3 className="secondary-title">Owners</h3>
              <ChannelOwnerList owners={owner_members} />
            </Col>
          </Row>
        </div>
      </Jumbotron>
    );
  }
}

export default withRouter(ChannelDetails);
