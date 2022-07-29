import { motion } from 'framer-motion';
import { Component } from 'react';
import { Card, CardBody } from 'reactstrap';
import ContentContainer from '../container/ContentContainer';
import ProfileCoverForm from '../picture-form/ProfileCoverForm';
import ProfilePictureForm from '../picture-form/ProfilePictureForm';
import BioEditForm from './BioEditForm';

class UserProfileEditForm extends Component {
  render() {
    return (
      <ContentContainer maxWidth={'900px'}>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <BioEditForm userID={this.props.userID} />

          <Card style={{ padding: '28px' }}>
            <CardBody>
              <ProfilePictureForm />
            </CardBody>
          </Card>
          <Card style={{ padding: '28px' }}>
            <CardBody>
              <ProfileCoverForm />
            </CardBody>
          </Card>
        </motion.div>
      </ContentContainer>
    );
  }
}

export default UserProfileEditForm;
