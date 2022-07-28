import React from 'react';
import { ConnectionsList } from '../../components/connections-list';
import { motion } from 'framer-motion';

class Connections extends React.Component {
  render() {
    return (
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        <ConnectionsList />
      </div>
    );
  }
}

export default Connections;
