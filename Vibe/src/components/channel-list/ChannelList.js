import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Row, Col } from 'reactstrap';

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
                            <Col key={i} md={3}>
                                <Card>
                                    <CardBody className="display-flex">
                                        <img
                                            src="https://i.imgur.com/A2Aw6XG.png"
                                            style={{ width: 70, height: 70 }}
                                            alt="Responsive"
                                            aria-hidden={true}
                                        />
                                        <div className="m-l">
                                            <h2 className="h4">{channel.name}</h2>
                                            <p className="text-muted">
                                                Channel description here. And replace the channel picture
                                            </p>
                                        </div>
                                    </CardBody>
                                </Card>
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