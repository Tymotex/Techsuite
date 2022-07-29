import React from 'react';

const BioField = ({ field, value }) => {
  return (
    <div className={`h5 text-muted`} style={{ marginBottom: '12px' }}>
      {value}
    </div>
  );
};

export default BioField;
