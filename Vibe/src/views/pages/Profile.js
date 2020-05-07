import React, { Component } from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { SubNavigation } from '../../vibe';

const NAV = [
  {
    name: 'All Channels',
    url: '/channels/all'
  },
  {
    name: 'My Channels',
    url: '/channels/own'
  }
];

class ChannelsDashboard extends Component {
  render() {
    const heroStyles = {
      padding: '50px 0 70px'
    };

    return (
      <div>
				<SubNavigation navList={NAV} /> 


      </div>
    );
  }
}

export default ChannelsDashboard;
