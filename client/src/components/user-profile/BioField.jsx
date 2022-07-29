import React from 'react';
import { Row, Col } from 'reactstrap';
import fieldStyles from './BioField.module.scss';

const BioField = ({ field, value }) => {
  return (
    <div className={`h5 text-muted`} style={{ marginBottom: '12px' }}>
      {value}
    </div>
  );
};

export default BioField;
