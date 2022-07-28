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
        <h1>{header}</h1>
        <Link to={linkTo}>
          <Button className="text-muted" style={{ borderRadius: '100px' }}>
            {buttonText}
          </Button>
        </Link>
      </div>
    </p>
  );
};

export default EmptyChannelPrompt;
