import React from 'react';
import { EmptyFiller } from '../../components/empty-filler';
import { motion } from 'framer-motion';

const Empty = ({ children }) => {
  return (
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
      <EmptyFiller>{children}</EmptyFiller>
    </motion.div>
  );
};

export default Empty;
