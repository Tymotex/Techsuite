import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { Channel } from '../channel';

const ChannelList = ({ allChannels, myChannels, isLoading, fetchSucceeded, showAll }) => {
    return (
        <Row>
            {(showAll) ? 
                (allChannels.length > 0) ? 
                    allChannels.map((channel, i) => 
                        <Col key={i} md={6}>
                            <Channel {...channel} />
                        </Col>
                    ) :
                    <p>There are currently no channels!</p> :
                (myChannels.length > 0) ?
                    myChannels.map((channel, i) => 
                        <Col key={i} md={6}>
                            <Channel {...channel} member_of={true} />
                        </Col>
                    ) :
                    <p>You currently own no channels!</p>
            }
        </Row> 
    );
}

ChannelList.propTypes = {
    isLoading: PropTypes.bool,
    fetchSucceeded: PropTypes.bool,
    allChannels: PropTypes.array,
    myChannels: PropTypes.array,
    showAll: PropTypes.bool
};

ChannelList.defaultProps = {
    isLoading: false,
    fetchSucceeded: false,
    allChannels: [],
    myChannels: [],
    showAll: true
}

export default ChannelList;