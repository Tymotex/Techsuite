import React, { Component } from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';

// Font-awesome icons:
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faPalette, faComment } from '@fortawesome/free-solid-svg-icons';
import { faHubspot } from '@fortawesome/free-brands-svg-icons';

// The feature showcase is rendered if the user is not logged in
const Showcase = () => {
  const heroStyles = {
    padding: '50px 0 70px'
  };
  const iconStyles = {
    width: "70px",
    height: "auto"
  };

  return (
    <div>
      {/* Welcome header: */}
      <Row>
        <Col md={6}>
          <div className="home-hero" style={heroStyles}>
            <h1>Welcome to Techsuite.</h1>
            <p className="text-muted">
              Chat and collaborate with fellow software engineers!
            </p>
          </div>
        </Col>
      </Row>
      
      {/* Cards: */}
      <Row>
        {/* Channels: */}
        <Col md={6}>
          <Card>
            <CardBody className="display-flex">
              <FontAwesomeIcon icon={faHubspot} style={iconStyles} />
              <div className="m-l">
                <h2 className="h4">Channels</h2>
                <p className="text-muted">
                  Create your own channels. 
                </p>
              </div>
            </CardBody>
          </Card>
        </Col>
        {/* Direct messages: */}
        <Col md={6}>
          <Card>
            <CardBody className="display-flex">
              <FontAwesomeIcon icon={faComment} style={iconStyles} />
              <div className="m-l">
                <h2 className="h4">Direct messaging</h2>
                <p className="text-muted">
                  Privately message other developers.
                </p>
              </div>
            </CardBody>
          </Card>
        </Col>
        {/* Personalise: */}
        <Col md={6}>
          <Card>
            <CardBody className="display-flex">
              <FontAwesomeIcon icon={faPalette} style={iconStyles} />
              <div className="m-l">
                <h2 className="h4">Personalise</h2>
                <p className="text-muted">
                  Show others what you are like.
                </p>
              </div>
            </CardBody>
          </Card>
        </Col>
        {/* Stay connected with the rapidly evolving software world */}
        <Col md={6}>
          <Card>
            <CardBody className="display-flex">
              <FontAwesomeIcon icon={faNewspaper} style={iconStyles} />
              <div className="m-l">
                <h2 className="h4">Keep up with trends</h2>
                <p className="text-muted">
                  Stay updated with the rapidly evolving software world!
                </p>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

class HomePage extends Component {
  render() {
    return (
      <Showcase />
    );
  }
}

export default HomePage;
