import React, { useState, cloneElement } from 'react';
import PropTypes from 'prop-types';
import './tooltip.scss';
import { Manager, Reference, Popper } from 'react-popper';
import ReactDOM from 'react-dom';

const renderTooltipContent = (isVisible, children) => (
  <Popper>
    {({ ref, style, arrowProps }) => (
      <>
        <div className="tooltip-arrow" ref={arrowProps.ref} style={arrowProps.style} />
        <div
          ref={ref}
          data-placement="bottom"
          className="c-tooltip"
          style={{ ...style, visibility: isVisible }}
        >
          <div className="tooltip-text">{children}</div>
        </div>
      </>
    )}
  </Popper>
);

function Tooltip({ reference, children, destinationId }) {
  const [isVisible, setVisibility] = useState('hidden');
  const destinationElement = destinationId && document.querySelector(`#${destinationId}`);
  console.log('d', destinationId, destinationElement);
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
      {destinationElement
        ? ReactDOM.createPortal(renderTooltipContent(isVisible, children), destinationElement)
        : renderTooltipContent(isVisible, children)}
    </Manager>
  );
}

Tooltip.propTypes = {
  reference: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  destinationId: PropTypes.string
};

export default Tooltip;
