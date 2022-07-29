import React from 'react';

const ContentContainer = ({ children, ...style }) => {
  return (
    <div style={{ maxWidth: '1200px', width: '100%', margin: '32px auto 0 auto', padding: '0px 32px', ...style }}>
      {children}
    </div>
  );
};

export default ContentContainer;
