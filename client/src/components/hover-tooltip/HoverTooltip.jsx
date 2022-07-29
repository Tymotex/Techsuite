import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';

const HoverTooltip = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <div>
      {props.children}
      <Tooltip isOpen={tooltipOpen} target={props.targetId} toggle={toggle} placement="bottom">
        {props.text}
      </Tooltip>
    </div>
  );
};

export default HoverTooltip;
