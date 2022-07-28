import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { ChannelCard } from '../channel';
import EmptyChannelPrompt from './EmptyChannelPrompt';

const ChannelList = ({ allChannels, myChannels, isLoading, fetchSucceeded, showAll, showPrompt }) => {
  return (
    <Row style={{ paddingLeft: '10px', paddingRight: '10px' }}>
      {showAll
        ? allChannels.length > 0
          ? allChannels.map((channel, i) => (
              <Col key={i} xs={6} lg={6} xl={6} xxl={4}>
                <ChannelCard {...channel} />
              </Col>
            ))
          : showPrompt && (
              <EmptyChannelPrompt
                header="There are no channels yet"
                buttonText="Start the action now ⚡"
                linkTo="/channels/new"
              />
            )
        : myChannels.length > 0
        ? myChannels.map((channel, i) => (
            <Col key={i} xs={6} lg={6} xl={6} xxl={4}>
              <ChannelCard {...channel} member_of={true} />
            </Col>
          ))
        : showPrompt && (
            <EmptyChannelPrompt
              header="You're not a member of any channel yet."
              buttonText="Join a Channel ⚡"
              linkTo="/channels/all"
            />
          )}
    </Row>
  );
};

ChannelList.propTypes = {
  isLoading: PropTypes.bool,
  fetchSucceeded: PropTypes.bool,
  allChannels: PropTypes.array,
  myChannels: PropTypes.array,
  showAll: PropTypes.bool,
};

ChannelList.defaultProps = {
  isLoading: false,
  fetchSucceeded: false,
  allChannels: [],
  myChannels: [],
  showAll: true,
};

export default ChannelList;
