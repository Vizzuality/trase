/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import Tippy from '@tippy.js/react';

import 'tippy.js/dist/tippy.css';
import './help-tooltip.scss';

function HelpTooltipComponent(props) {
  const { children, referenceComponent: ReferenceComponent, position, text, interactive } = props;
  const parsedText = interactive ? <div dangerouslySetInnerHTML={{ __html: text }} /> : text;

  return (
    <span className="c-help-tooltip">
      <Tippy
        content={children || parsedText}
        animation="none"
        placement={position}
        arrow
        theme="blue"
        duration={0}
        offset={20}
        zIndex={102}
        interactive={interactive}
        boundary="window"
        appendTo={document.body}
      >
        {ReferenceComponent ? (
          <ReferenceComponent />
        ) : (
          <svg className="icon tooltip-react-icon">
            <use xlinkHref="#icon-layer-info" />
          </svg>
        )}
      </Tippy>
    </span>
  );
}

HelpTooltipComponent.propTypes = {
  text: PropTypes.string,
  children: PropTypes.any,
  position: PropTypes.string,
  referenceComponent: PropTypes.node,
  interactive: PropTypes.bool
};

HelpTooltipComponent.defaultProps = {
  position: 'bottom'
};

export default HelpTooltipComponent;
