import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './tooltip.scss';
import { Manager, Reference, Popper } from 'react-popper';

function Tooltip({ reference, referenceClassName, children, type }) {
  const [isVisible, setVisibility] = useState('hidden');
  if (type === 'html') return null; // TODO: html tooltip
  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <text
            x="0"
            y="3"
            fill="#fff"
            className={referenceClassName}
            ref={ref}
            onMouseEnter={() => setVisibility('visible')}
            onMouseLeave={() => setVisibility('hidden')}
          >
            {reference}
          </text>
        )}
      </Reference>
      <Popper>
        {({ ref, style }) => (
          <g
            ref={ref}
            data-placement="right"
            className="c-tooltip"
            style={{ ...style, visibility: isVisible }}
          >
            <text x="0" y="3" fill="#fff">
              {children}
            </text>
            <rect fill="#555555" height="40" width="200" />
          </g>
        )}
      </Popper>
    </Manager>
  );
}

Tooltip.propTypes = {
  type: PropTypes.string,
  reference: PropTypes.node.isRequired,
  referenceClassName: PropTypes.string,
  children: PropTypes.node.isRequired
};

Tooltip.defaultProps = {
  type: 'html'
};

export default Tooltip;
