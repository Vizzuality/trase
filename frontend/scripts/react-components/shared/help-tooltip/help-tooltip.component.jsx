/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tippy from '@tippy.js/react';

import 'tippy.js/dist/tippy.css';
import './help-tooltip.scss';

function tooltipContent(children, showInfoIcon, ReferenceComponent) {
  if (!showInfoIcon) {
    return <span>{children}</span>;
  }
  if (showInfoIcon && ReferenceComponent) {
    return <ReferenceComponent />;
  }
  return (
    <svg className="icon tooltip-react-icon">
      <use xlinkHref="#icon-layer-info" />
    </svg>
  );
}

// Tooltip used for info mostly
function HelpTooltipComponent(props) {
  const {
    theme,
    showInfoIcon,
    children,
    referenceComponent: ReferenceComponent,
    position,
    text,
    interactive,
    className
  } = props;
  const parsedText = interactive ? <div dangerouslySetInnerHTML={{ __html: text }} /> : text;

  return (
    <span className={cx('c-help-tooltip', className)}>
      <Tippy
        content={parsedText}
        animation="none"
        placement={position}
        arrow={false}
        theme={theme}
        duration={0}
        offset={20}
        zIndex={102}
        interactive={interactive}
        boundary="window"
        appendTo={document.body}
      >
        {tooltipContent(children, showInfoIcon, ReferenceComponent)}
      </Tippy>
    </span>
  );
}

HelpTooltipComponent.propTypes = {
  theme: PropTypes.string,
  text: PropTypes.string,
  showInfoIcon: PropTypes.bool,
  children: PropTypes.any,
  position: PropTypes.string,
  referenceComponent: PropTypes.node,
  className: PropTypes.string,
  interactive: PropTypes.bool
};

HelpTooltipComponent.defaultProps = {
  position: 'bottom',
  theme: 'gradient-padding',
  showInfoIcon: true,
  className: undefined
};

export default HelpTooltipComponent;
