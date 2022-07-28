import React from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

const EmptyChannelPrompt = (props) => {
  const heroStyles = {
    padding: '50px 0 70px',
  };
  const { header, linkTo, buttonText } = props;
  return (
    <p>
      {/* Welcome header: */}
      <div className="home-hero" style={heroStyles}>
        <h2>{header}</h2>
        <Link to={linkTo}>
          <Button className="text-muted" style={{ borderRadius: '100px', paddingLeft: '14px', paddingRight: '14px' }}>
            {buttonText}
          </Button>
        </Link>
      </div>
    </p>
  );
};

export default EmptyChannelPrompt;
