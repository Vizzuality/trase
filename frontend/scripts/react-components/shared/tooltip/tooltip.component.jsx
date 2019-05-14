import React, { useState, cloneElement } from 'react';
import PropTypes from 'prop-types';
import './tooltip.scss';
import { Manager, Reference, Popper } from 'react-popper';
import ReactDOM from 'react-dom';

function Tooltip({ reference, children, type, destinationId }) {
  const [isVisible, setVisibility] = useState('hidden');
  if (type === 'html') return null; // TODO: html tooltip
  return (
    <Manager>
      <Reference>
        {({ ref }) =>
          cloneElement(reference, {
            ref,
            onMouseEnter: () => setVisibility('visible'),
            onMouseLeave: () => setVisibility('hidden')
          })
        }
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
              <div className="tooltip-text">{children}</div>
              <div ref={arrowProps.ref} style={arrowProps.style} />
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
  children: PropTypes.node.isRequired,
  destinationId: PropTypes.string
};

Tooltip.defaultProps = {
  type: 'html'
};

export default Tooltip;
