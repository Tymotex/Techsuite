import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { Channel } from '../channel';

const ChannelList = (props) => {
    return (
        <div>
            {/* TODO: Show a loading message or backdrop */}
            {(props.isLoading) ? 
                <p>Loading all channels...</p> :
                ""
            }
            
            {(props.fetchSucceeded) ?
                <Row>
                    {/* Display all the channels returned by the server OR show a message if there's none  */}
                    {(props.channels.length > 0) ? 
                        props.channels.map((channel, i) => 
                            <Col md={6}>
                                <Channel key={i} {...channel} />
                            </Col>
                        ) :
                        /* No channels exist in the database */
                        "There are currently no channels!" 
                    }
                </Row> :
                /* Show an error message if the API failed */
                "Something went wrong! DevMessenger couldn't fetch the channels :("
            }
        </div>
    );
}

ChannelList.propTypes = {
    isLoading: PropTypes.bool,
    fetchSucceeded: PropTypes.bool,
    channels: PropTypes.array
};

ChannelList.defaultProps = {
    isLoading: false,
    fetchSucceeded: false,
    channels: []
}

export default ChannelList;