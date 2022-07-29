import { faHubspot } from '@fortawesome/free-brands-svg-icons';
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import { faComment, faNewspaper, faPalette, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import YouTube from 'react-youtube';
import { matchPath } from 'react-router';
import Cookie from 'js-cookie';
import { motion } from 'framer-motion';
import ContentContainer from '../../components/container/ContentContainer';

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
    strict: false,
  });
  if (match) {
    if (match.params.id && match.params.token) {
      userID = match.params.id;
      token = match.params.token;
      Cookie.set('token', token);
      Cookie.set('user_id', userID);
      props.history.push('/home');
    }
  }
  // Proceed with rendering the homepage
  const heroStyles = {
    padding: '50px 0 24px 0px',
  };
  const iconStyles = {
    width: '70px',
    height: 'auto',
  };

  const opts = {
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  return (
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
      <ContentContainer>
        {/* Welcome header: */}
        <div className="home-hero" style={heroStyles}>
          <h1>Welcome to Techsuite.</h1>
          <p className="text-muted" style={{ marginTop: '12px' }}>
            A platform for realtime group messaging, networking and sharing ideas, built with React, Flask and
            PostgreSQL.
            <span role="img" aria-label="unicode sprout">
              🌱
            </span>
          </p>
          <p className="text-muted">
            See <a href="https://github.com/Tymotex/Techsuite">Techsuite GitHub</a>.
          </p>
        </div>

        {/* Cards: */}
        <Row>
          {/* Channels: */}
          <Col md={6} style={{ margin: '10px 0px' }}>
            <Card style={{ height: '100%' }}>
              <CardBody className="display-flex" style={{ alignItems: 'center' }}>
                <FontAwesomeIcon icon={faHubspot} style={iconStyles} />
                <div className="m-l">
                  <h2 className="h4">Channels</h2>
                  <p className="text-muted">
                    Create workspaces and invite other users to collaborate on group projects or discuss ideas.
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* Network */}
          <Col md={6} style={{ margin: '10px 0px' }}>
            <Card style={{ height: '100%' }}>
              <CardBody className="display-flex" style={{ alignItems: 'center' }}>
                <FontAwesomeIcon icon={faUsers} style={iconStyles} />
                <div className="m-l">
                  <h2 className="h4">Networking</h2>
                  <p className="text-muted">Form and manage connections with other people and grow your network.</p>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* Personalise: */}
          <Col md={6} style={{ margin: '10px 0px' }}>
            <Card style={{ height: '100%' }}>
              <CardBody className="display-flex" style={{ alignItems: 'center' }}>
                <FontAwesomeIcon icon={faPalette} style={iconStyles} />
                <div className="m-l">
                  <h2 className="h4">Personalise</h2>
                  <p className="text-muted">Personalise your user profile, channels and user experience.</p>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* Stay connected with the rapidly evolving software world */}
          <Col md={6} style={{ margin: '10px 0px' }}>
            <Card style={{ height: '100%' }}>
              <CardBody className="display-flex" style={{ alignItems: 'center' }}>
                <FontAwesomeIcon icon={faNewspaper} style={iconStyles} />
                <div className="m-l">
                  <h2 className="h4">Stay tech-savvy</h2>
                  <p className="text-muted">Keep yourself updated with the rapidly evolving software world.</p>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* Direct Messaging */}
          <Col md={6} style={{ margin: '10px 0px' }}>
            <Card style={{ height: '100%' }}>
              <CardBody className="display-flex" style={{ alignItems: 'center' }}>
                <FontAwesomeIcon icon={faComment} style={iconStyles} />
                <div className="m-l">
                  <h2 className="h4">Direct messaging</h2>
                  <p className="text-muted">Privately message other collaborators.</p>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* GitHub */}
          <Col md={6} style={{ margin: '10px 0px' }}>
            <Card style={{ height: '100%' }}>
              <CardBody className="display-flex" style={{ alignItems: 'center' }}>
                <FontAwesomeIcon icon={faMobileAlt} style={iconStyles} />
                <div className="m-l">
                  <h2 className="h4">Mobile-Installable</h2>
                  <p className="text-muted">
                    Techsuite is PWA-compliant and is available for installation on mobile devices.
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <br />
        <div className={'video-container'}>
          <YouTube videoId="C4o2fOCq2cI" opts={opts} onReady={(e) => e.target.pauseVideo()} />
        </div>
      </ContentContainer>
    </motion.div>
  );
});

export default withRouter(Showcase);
