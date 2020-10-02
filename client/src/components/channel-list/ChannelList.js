import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { Channel } from '../channel';
import EmptyChannelPrompt from './EmptyChannelPrompt';

const ChannelList = ({ allChannels, myChannels, isLoading, fetchSucceeded, showAll }) => {
    return (
        <Row style={{"paddingLeft": "10px", "paddingRight": "10px"}}>
            {(showAll) ? 
                (allChannels.length > 0) ? 
                    allChannels.map((channel, i) => 
                        <Col key={i} md={6}>
                            <Channel {...channel} />
                        </Col>
                    ) :
                    <EmptyChannelPrompt 
                        header="There are no channels yet"
                        buttonText="Start the action now ⚡"
                        linkTo="/channels/new" /> :
                (myChannels.length > 0) ?
                    myChannels.map((channel, i) => 
                        <Col key={i} md={6}>
                            <Channel {...channel} member_of={true} />
                        </Col>
                    ) :
                    <EmptyChannelPrompt 
                        header="You're not a part of any channel yet" 
                        buttonText="Find a channel to join ⚡"
                        linkTo="/channels/all" />
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