import React, { Component } from 'react';
import ProfilePictureForm from '../picture-form/ProfilePictureForm';
import ProfileCoverForm from '../picture-form/ProfileCoverForm';
import { Row, Col, Card, CardBody } from 'reactstrap';
import BioEditForm from './BioEditForm';
import ContentContainer from '../container/ContentContainer';

class UserProfileEditForm extends Component {
  render() {
    return (
      <ContentContainer maxWidth={'720px'}>
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
      </ContentContainer>
    );
  }
}

export default UserProfileEditForm;
