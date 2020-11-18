import { faGithub, faHubspot } from '@fortawesome/free-brands-svg-icons';
import { faComment, faNewspaper, faPalette, faUsers } from '@fortawesome/free-solid-svg-icons';
// Font-awesome icons:
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { withRouter } from 'react-router-dom';

import { matchPath } from 'react-router'
import Cookie from 'js-cookie';

// Feature showcase
const Showcase = withRouter((props) => {

  let userID, token;

  // Workaround for Google auth: the callback in the Flask server redirects back
  // to the homepage and embeds the token and id in the URL like this:
  //     /home/user_id/token
  // The token and ID are extracted and removed out of the URL and saved to the 
  // client's cookies 
  const match = matchPath(props.history.location.pathname, {
    path: '/home/:id/:token',
    exact: true,
    strict: false
  });  
  if (match) {
    if (match.params.id && match.params.token) {
      userID = match.params.id;
      token = match.params.token;
      Cookie.set("token", token);
      Cookie.set("user_id", userID);
      props.history.push("/home");
    }
  } 
  // Proceed with rendering the homepage
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
      <div className="home-hero" style={heroStyles}>
        <h1>Welcome to Techsuite.</h1>
        <p className="text-muted">
          An app for collaborating, networking and sharing ideas <span role="img" aria-label="unicode sprout">🌱</span>
        </p>
      </div>
      
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
                  Create channels and invite other users to collaborate on group projects or discuss ideas
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
                  Form connections with other people and grow your network.
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
                  Personalise your user profile, channels and user experience
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
                  Privately message other collaborators.
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
                <h2 className="h4">Open-Source Project</h2>
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
});

// class HomePage extends Component {
//   render() {
//     return (
//       <Showcase />
//     );
//   }
// }

export default withRouter(Showcase);
