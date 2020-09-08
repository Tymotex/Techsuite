import { faGithub, faHubspot } from '@fortawesome/free-brands-svg-icons';
import { faComment, faNewspaper, faPalette, faUsers } from '@fortawesome/free-solid-svg-icons';
// Font-awesome icons:
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';


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
              An app for collaborating, networking and sharing ideas <span role="img" aria-label="unicode sprout">🌱</span>
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
                  Create channels and invite other users to collaborate on group projects or discuss the latest memes
                </p>
              </div>
            </CardBody>
          </Card>
        </Col>
        {/* Network */}
        <Col md={6}>
          <Card>
            <CardBody className="display-flex">
              <FontAwesomeIcon icon={faUsers} style={iconStyles} />
              <div className="m-l">
                <h2 className="h4">Networking</h2>
                <p className="text-muted">
                  Connect with other people and grow your network.
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
                  Personalise your channels and user profile
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
                <h2 className="h4">Stay tech-savvy</h2>
                <p className="text-muted">
                  Keep yourself updated with the rapidly evolving software world
                </p>
              </div>
            </CardBody>
          </Card>
        </Col>
        {/* Direct Messaging */}
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
        {/* GitHub */}
        <Col md={6}>
          <Card>
            <CardBody className="display-flex">
              <FontAwesomeIcon icon={faGithub} style={iconStyles} />
              <div className="m-l">
                <h2 className="h4">Support Open-Source</h2>
                <p className="text-muted">
                  <a href="https://github.com/Tymotex/Techsuite">Techsuite GitHub</a>
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
