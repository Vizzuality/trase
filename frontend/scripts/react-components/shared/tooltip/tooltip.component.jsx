import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './tooltip.scss';
import { Manager, Reference, Popper } from 'react-popper';

function Tooltip({ reference, children }) {
  const [isVisible, setVisibility] = useState('hidden');
  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <span
            ref={ref}
            onMouseEnter={() => setVisibility('visible')}
            onMouseLeave={() => setVisibility('hidden')}
          >
            {reference}
          </span>
        )}
      </Reference>
      <Popper>
        {({ ref, style, placement }) => (
          <div
            ref={ref}
            style={{ ...style, visibility: isVisible }}
            data-placement={placement}
            className="c-tooltip"
          >
            {children}
          </div>
        )}
      </Popper>
    </Manager>
  );
}

Tooltip.propTypes = {
  reference: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
};

export default Tooltip;
