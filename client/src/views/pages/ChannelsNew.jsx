import React from 'react';
import { ChannelForm } from '../../components/channel-form';
import { Card, CardBody } from 'reactstrap';
import { motion } from 'framer-motion';
import ContentContainer from '../../components/container/ContentContainer';

class ChannelsNew extends React.Component {
  render() {
    return (
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <ContentContainer>
          <Card style={{ padding: '32px' }}>
            <CardBody>
              <h1 style={{ marginBottom: '24px' }}>Create a channel.</h1>
              <ChannelForm />
            </CardBody>
          </Card>
        </ContentContainer>
      </motion.div>
    );
  }
}

export default ChannelsNew;
