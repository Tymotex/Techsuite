import React, { Component } from 'react';
import ProfilePictureForm from '../picture-form/ProfilePictureForm';
import ProfileCoverForm from '../picture-form/ProfileCoverForm';
import { Row, Col, Card, CardBody } from 'reactstrap';
import BioEditForm from './BioEditForm';
import ContentContainer from '../container/ContentContainer';
import { motion } from 'framer-motion';

class UserProfileEditForm extends Component {
  render() {
    return (
      <ContentContainer maxWidth={'720px'}>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <BioEditForm userID={this.props.userID} />

          <Row>
            <Col md={6}>
              <Card style={{ padding: '28px' }}>
                <CardBody>
                  <ProfilePictureForm />
                </CardBody>
              </Card>
            </Col>
            <Col md={6}>
              <Card style={{ padding: '28px' }}>
                <CardBody>
                  <ProfileCoverForm />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </motion.div>
      </ContentContainer>
    );
  }
}

export default UserProfileEditForm;
