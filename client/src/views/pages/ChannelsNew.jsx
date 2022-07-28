import React from 'react';
import { ChannelForm } from '../../components/channel-form';
import { Card, CardBody } from 'reactstrap';
import { motion } from 'framer-motion';

class ChannelsNew extends React.Component {
  render() {
    return (
      <motion.div
        style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card style={{ padding: '32px' }}>
          <CardBody>
            <h1 style={{ marginBottom: '24px' }}>Create a New Channel</h1>
            <ChannelForm />
          </CardBody>
        </Card>
      </motion.div>
    );
  }
}

export default ChannelsNew;
