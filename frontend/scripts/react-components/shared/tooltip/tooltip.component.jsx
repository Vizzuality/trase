import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './tooltip.scss';
import { Manager, Reference, Popper } from 'react-popper';
import ReactDOM from 'react-dom';
import Text from 'react-components/shared/text';

function Tooltip({ reference, referenceClassName, children, type, destinationId }) {
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
      {ReactDOM.createPortal(
        <Popper>
          {({ ref, style, placement, arrowProps }) => (
            <div
              ref={ref}
              data-placement={placement}
              className="c-tooltip"
              style={{ ...style, visibility: isVisible }}
            >
              <div ref={arrowProps.ref} style={arrowProps.style} />
              <div className="tooltip-text">
                <Text variant="mono" as="span" color="white" weight="bold">
                  {children}
                </Text>
              </div>
            </div>
          )}
        </Popper>,
        document.querySelector(`#${destinationId}`)
      )}
    </Manager>
  );
}

Tooltip.propTypes = {
  type: PropTypes.string,
  reference: PropTypes.node.isRequired,
  referenceClassName: PropTypes.string,
  children: PropTypes.node.isRequired,
  destinationId: PropTypes.string
};

Tooltip.defaultProps = {
  type: 'html'
};

export default Tooltip;
