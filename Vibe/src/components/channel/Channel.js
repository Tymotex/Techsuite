import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from 'reactstrap';

const Channel = ({ name, image, description, isPublic }) => {
    return (
        <Card>
            <CardBody className="display-flex">
                <img
                    src={image}
                    style={{ width: 70, height: 70 }}
                    alt="Responsive"
                    aria-hidden={true}
                />
                <div className="m-l">
                    <h2 className="h4">{name}</h2>
                    {(isPublic) ? 
                        <em>Public Channel</em> :
                        <em>Private Channel</em>
                    }
                    <p className="text-muted">
                        {description}
                    </p>
                </div>
            </CardBody>
        </Card>
    );
}

Channel.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,  // TODO: Placeholder type. Eventually I want to upload image files
    isPublic: PropTypes.bool
};

Channel.defaultProps = {
    name: "Unnamed",
    description: "This channel's creator didn't set a description",
    image: "https://i.imgur.com/A2Aw6XG.png",  // TODO: Placeholder
    isPublic: true
};

export default Channel;
